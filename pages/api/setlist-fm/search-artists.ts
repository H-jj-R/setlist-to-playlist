import { NextApiRequest, NextApiResponse } from "next";
import { setTimeout } from "timers/promises";

/**
 * Search for an artist.
 * @param req Request details and parameters
 * @param res Response object
 * @returns Full details for a matching artist
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { artistName } = req.query;
    const maxRetries = 5;
    const baseDelay = 1000;

    async function fetchArtist(retries: number = 0): Promise<Response> {
        const url = `https://api.setlist.fm/rest/1.0/search/artists?artistName=${artistName}&p=1&sort=relevance`;
        const params = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "x-api-key": process.env.SETLIST_FM_API_KEY!
            }
        };
        const response = await fetch(url, params);

        if (response.status === 429 && retries < maxRetries) {
            const retryAfterHeader = response.headers.get("Retry-After");
            const retryAfter = retryAfterHeader
                ? parseInt(retryAfterHeader, 10) * 1000
                : baseDelay * Math.pow(2, retries);
            await setTimeout(retryAfter);
            return fetchArtist(retries + 1);
        }

        return response;
    }

    try {
        const response = await fetchArtist();

        if (!response.ok) {
            const errorText = await response.text();
            res.status(response.status).json({
                error: "Failed to fetch artist",
                details: errorText
            });
            return;
        }

        const data = await response.json();

        if (!data.artist || data.artist.length === 0) {
            res.status(404).json({ error: "Artist not found" });
            return;
        }

        const artist = data.artist.find((artist) => artist.name.toLowerCase() === artistName.toString().toLowerCase());

        if (!artist) {
            res.status(404).json({
                error: "No artist found."
            });
            return;
        }

        res.status(200).json(artist);
    } catch (error) {
        res.status(500).json({ error: "Error fetching artist." });
    }
}
