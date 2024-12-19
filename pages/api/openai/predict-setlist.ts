import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const ISACTIVE = false;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

// Define the schema for the predicted setlists
const PredictedSetlistSchema = z.array(
    z.object({
        predictedSongs: z.array(
            z.object({
                name: z.string(),
                artist: z.string()
            })
        )
    })
);

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
                            return song.cover ? `${song.name} (${song.cover.name} cover)` : song.name;
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
                            "You are a setlist predictor. Based on the past setlists provided, predict the next setlist for the artist. Return each song along with its artist. Provide 3 possible predictions."
                    },
                    {
                        role: "user",
                        content: `Here are the past setlists:\n${input}`
                    }
                ],
                response_format: zodResponseFormat(PredictedSetlistSchema, "predicted_setlists")
            });

            // 3. Parse the structured response
            const predictedSetlists = completion.choices.map((choice) => choice.message.parsed);

            // 4. Respond to the client
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
