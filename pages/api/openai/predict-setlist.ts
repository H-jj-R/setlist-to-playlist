import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/constants/db";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { jwtDecode } from "jwt-decode";

const ISACTIVE = false;
const DAILY_QUERY_LIMIT = 5;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

// Define the schema for the predicted setlists
const PredictedSetlistSchema = z.object({
    predictedSetlists: z.array(
        z.object({
            predictedSongs: z.array(
                z.object({
                    name: z.string(),
                    artist: z.string(),
                    tape: z.boolean()
                })
            )
        })
    )
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!ISACTIVE) {
        res.status(500).json({
            error: "OpenAI API currently disabled"
        });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorisation token missing or invalid" });
    }
    const userToken = authHeader.split(" ")[1];

    try {
        const userId = (jwtDecode(userToken) as any).userId;

        // Check if the user exists in the UserQueryLimits table
        const [rows]: [any[], any] = await db.execute("SELECT * FROM UserQueryLimits WHERE user_id = ? LIMIT 1", [
            userId
        ]);

        let userQueryLimit = rows[0]; // Extract the first row

        if (!userQueryLimit) {
            // If the user does not exist in the table, insert a new record
            await db.execute(
                "INSERT INTO UserQueryLimits (user_id, queries_today, last_query_date) VALUES (?, 0, CURRENT_DATE)",
                [userId]
            );

            // Fetch the newly inserted row
            const [newRows]: [any[], any] = await db.execute(
                "SELECT * FROM UserQueryLimits WHERE user_id = ? LIMIT 1",
                [userId]
            );

            userQueryLimit = newRows[0];
        }

        const { queries_today, last_query_date } = userQueryLimit;

        // Reset queries_today if the last query date is before today
        const today = new Date().toISOString().split("T")[0];
        const lastQueryDate = new Date(last_query_date).toISOString().split("T")[0];
        if (lastQueryDate < today) {
            await db.execute(
                "UPDATE UserQueryLimits SET queries_today = 0, last_query_date = CURRENT_DATE WHERE user_id = ?",
                [userId]
            );
        } else {
        // Enforce the query limit
        if (queries_today >= DAILY_QUERY_LIMIT) {
            return res.status(429).json({ error: "Daily query limit reached" });
            }
        }

        // Increment the query count for the user
        await db.execute("UPDATE UserQueryLimits SET queries_today = queries_today + 1 WHERE user_id = ?", [userId]);

        // Filter and format the past setlists for input
        const { pastSetlists } = req.body;
        const input = pastSetlists
            .filter((setlist: any) => setlist.sets && setlist.sets.set.length > 0) // Only include setlists with songs
            .slice(0, 20) // Limit to the first 20 setlists
            .map((setlist: any) => {
                const artistName = setlist.artist.name;
                const eventDate = setlist.eventDate;

                // Flatten the song list from all sets
                const songs = setlist.sets.set.flatMap((set: any) =>
                    set.song.map((song: any) => {
                        // Check if the song has a cover and append it to the name
                        return `${song.name}${song.cover ? ` (${song.cover.name} cover)` : ""}${
                            song.tape ? " (Played on tape)" : ""
                        }`;
                    })
                );

                return {
                    artistName,
                    eventDate,
                    songs
                };
            })
            .map((setlist) => {
                return `Setlist for ${setlist.artistName} on ${setlist.eventDate}: ${setlist.songs.join(", ")}`;
            })
            .join("\n");

        // Send the request to GPT-4o-mini with a structured response format
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a setlist predictor. Using the past setlists provided, predict the next setlist for the artist. Return each song name, with its artist, and with a boolean for whether the song is played on tape. Provide 3 possible predictions. The first predicted setlist should be the most likely possible setlist, the second predicted setlist should be a likely setlist but not as likely as the first predicted setlist, and the third predicted setlist should have a bit more variance. None of these setlists should be the same as each other."
                },
                {
                    role: "user",
                    content: `Here are the past setlists:\n${input}`
                }
            ],
            response_format: zodResponseFormat(PredictedSetlistSchema, "predictedSetlists"),
            temperature: 0.7,
            top_p: 1
        });

        // Parse the structured response
        const predictedSetlists = completion.choices.map((choice) => choice.message.parsed)[0];
        console.log(JSON.stringify(predictedSetlists));

        res.status(200).json(predictedSetlists);
    } catch (error) {
        console.error("Error predicting setlist:", error);
        res.status(500).json({
            error: "Failed to predict setlist"
        });
    }
}
