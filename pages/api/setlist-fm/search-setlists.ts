import { NextApiRequest, NextApiResponse } from "next";
import { setTimeout } from "timers/promises";

/**
 * API handler to search for a setlist by artist Mbid.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { artistMbid, page = 1 } = req.query;

    /**
     * Fetches a setlist from the Setlist.fm API, with retry logic for handling rate limits (429 errors).
     *
     * @param retries - The current retry attempt number.
     * @returns A Promise resolving to the API response.
     */
    async function fetchSetlist(retries: number = 0): Promise<Response> {
        const response = await fetch(
            `https://api.setlist.fm/rest/1.0/search/setlists?${new URLSearchParams({
                artistMbid: artistMbid as string,
                p: page as string,
                sort: "recency"
            }).toString()}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "x-api-key": process.env.SETLIST_FM_API_KEY!
                }
            }
        );

        // If the API rate limits (429 status) and we haven't exceeded max retries, retry after a delay
        if (response.status === 429 && retries < 5) {
            const retryAfterHeader = response.headers.get("Retry-After"); // Check for a Retry-After header
            // Wait before retrying
            await setTimeout(
                retryAfterHeader
                    ? parseInt(retryAfterHeader, 10) // Use Retry-After if provided
                    : 1000 * Math.pow(2, retries)
            );
            return fetchSetlist(retries + 1); // Recursive call with incremented retry count
        }

        return response;
    }

    try {
        const response = await fetchSetlist();

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!response.ok) {
            return res.status(response.status).json({
                error: "setlistFmSearchSetlistError"
            });
        }

        const data = await response.json();

        if (!data.setlist || data.setlist.length === 0) {
            return res.status(404).json({
                error: "setlistFmNoSetlistsError"
            });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "internalServerError"
        });
    }
}
