/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

/**
 * Flag to manually enable/disable the OpenAI API.
 */
const ISACTIVE = true;

/**
 *  Defines the schema for the 3 predicted setlists response from the API.
 */
const PredictedSetlistSchema = z.object({
    predictedSetlists: z.object({
        setlist1: z.object({
            predictedSongs: z.array(
                z.object({
                    artist: z.string(),
                    name: z.string(),
                    tape: z.boolean()
                })
            )
        }),
        setlist2: z.object({
            predictedSongs: z.array(
                z.object({
                    artist: z.string(),
                    name: z.string(),
                    tape: z.boolean()
                })
            )
        }),
        setlist3: z.object({
            predictedSongs: z.array(
                z.object({
                    artist: z.string(),
                    name: z.string(),
                    tape: z.boolean()
                })
            )
        })
    })
});

/**
 * API handler to generate a setlist prediction based on past setlists.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Immediately stop the request if the OpenAI API has been  manually disabled
    if (!ISACTIVE) res.status(500).json({ error: "generateSetlist:openaiDisabled" });

    try {
        const { pastSetlists } = req.body;

        // If all sets have no songs, return an error.
        if (
            pastSetlists.filter((setlist: Record<string, any>): boolean => setlist.sets && setlist.sets.set.length > 0)
                .length === 0
        ) {
            throw new Error();
        }

        // Filter and format the past setlists for input
        const input = pastSetlists
            .filter((setlist: Record<string, any>) => setlist.sets && setlist.sets.set.length > 0) // Only include setlists with songs
            .slice(0, 20) // Limit to the first 20 setlists
            .map((setlist: Record<string, any>) => {
                const artistName = setlist.artist.name;
                const eventDate = setlist.eventDate;
                // Flatten the song list from all sets
                const songs = setlist.sets.set.flatMap((set: Record<string, any>) =>
                    set.song.map((song: Record<string, any>): string => {
                        // Check if the song has a cover and append it to the name
                        return `${song.name}${song.cover ? ` (${song.cover.name} cover)` : ""}${
                            song.tape ? " (Played on tape)" : ""
                        }`;
                    })
                );

                return { artistName, eventDate, songs };
            })
            .map((setlist: Record<string, any>): string => {
                return `Setlist for ${setlist.artistName} on ${setlist.eventDate}: ${setlist.songs.join(", ")}`;
            })
            .join("\n");

        // Send the request to GPT-4o-mini with a structured response format
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
        const completion = await openai.beta.chat.completions.parse({
            messages: [
                {
                    content: `You are a setlist predictor. Based on the past setlists provided, predict exactly three possible future setlists for the artist. 
                    **Rules for the Predictions:**
                        - You **must** return exactly **three** predicted setlists.
                        - Each setlist **must** contain a list of predicted songs.
                        - Each setlist **must** be distinct:
                            1. **Setlist 1** should be the most likely prediction, closely following recent setlist trends.
                            2. **Setlist 2** should be slightly different but still realistic based on historical patterns.
                            3. **Setlist 3** should introduce significant variation, such as rare songs or surprises, but should still be realistically possible.
                    **Formatting & Constraints:**
                        - Do **not** repeat identical setlists.
                        - If a song is a cover, include the original artist's name in the 'artist' field, **not** in the song name, and **not** the name of the artist you're predicting setlists for.
                        - If a song is played on tape, set 'tape' to **true**; otherwise, set it to **false**. Do **not** include this in the song name.
                    **Final Requirement:** You **must** return a structured JSON response that follows the provided schema exactly. If you are unsure, ensure that three unique setlists are always included.`,
                    role: "system"
                },
                {
                    content: `Here are the past setlists:\n${input}`,
                    role: "user"
                }
            ],
            model: "gpt-4o-mini",
            response_format: zodResponseFormat(PredictedSetlistSchema, "predictedSetlists"),
            temperature: 0.6,
            top_p: 1
        });

        // Parse the structured response
        const predictedSetlists = completion.choices.map((choice) => choice.message.parsed)[0];

        res.status(200).json(predictedSetlists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "generateSetlist:predictSetlistFailed" });
    }
}
