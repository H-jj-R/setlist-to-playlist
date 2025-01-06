import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const ISACTIVE = false;

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
    const { pastSetlists } = req.body;
    if (ISACTIVE) {
        try {
            // 1. Filter and format the past setlists for input
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

            // 2. Send the request to GPT-4o-mini with a structured response format
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
                temperature: 0.8,
                top_p: 1
            });

            // 3. Parse the structured response
            const predictedSetlists = completion.choices.map((choice) => choice.message.parsed)[0];
            console.log(JSON.stringify(predictedSetlists));

            res.status(200).json(predictedSetlists);
        } catch (error) {
            console.error("Error predicting setlist:", error);
            res.status(500).json({
                error: "Failed to predict setlist"
            });
        }
    } else {
        res.status(500).json({
            error: "OpenAI API currently disabled"
        });
    }
}
