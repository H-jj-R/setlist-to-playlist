import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const ISACTIVE = true;

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
            error: "errors:openaiDisabled"
        });
    }

    try {
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
                    content: `You are a setlist predictor. Using the past setlists provided, predict the next setlist for the artist.
                    Return exactly 3 possible predictions as an array. Each setlist must be distinct:
                    - The first predicted setlist should be the most likely.
                    - The second predicted setlist should be slightly less likely but still plausible.
                    - The third predicted setlist should have significant variance.
                    Ensure all 3 setlists are different from each other.`
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
        console.error(error);
        res.status(500).json({
            error: "errors:predictSetlistFailed"
        });
    }
}
