import { NextApiRequest, NextApiResponse } from "next";
import { setTimeout } from "timers/promises";

/**
 * Search for a setlist.
 * @param req Request details and parameters
 * @param res Response object
 * @returns The most recent setlist from an artist with a matching name
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { artistMbid } = req.query;
    const maxRetries = 5;
    const baseDelay = 1000;

    async function fetchSetlist(retries: number = 0): Promise<Response> {
        const url = `https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=${artistMbid}&p=1&sort=recency`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "x-api-key": process.env.SETLIST_FM_API_KEY!
            }
        });

        if (response.status === 429 && retries < maxRetries) {
            const retryAfterHeader = response.headers.get("Retry-After");
            const retryAfter = retryAfterHeader
                ? parseInt(retryAfterHeader, 10) * 1000
                : baseDelay * Math.pow(2, retries);
            await setTimeout(retryAfter);
            return fetchSetlist(retries + 1);
        }

        return response;
    }

    try {
        const response = await fetchSetlist();

        if (!response.ok) {
            const errorText = await response.text();
            res.status(response.status).json({
                error: "Failed to fetch setlist",
                details: errorText
            });
            return;
        }

        const data = await response.json();

         // Filter out setlists with no songs
         if (data.setlist) {
            data.setlist = data.setlist.filter((setlist: any) =>
                setlist.sets.set.some((set: any) => set.song && set.song.length > 0)
            );
        }

        if (!data.setlist || data.setlist.length === 0) {
            res.status(404).json({
                error: `No setlists found for artist with mbid: ${artistMbid}`
            });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching setlist" });
    }
}
