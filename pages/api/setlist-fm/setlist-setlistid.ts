import { NextApiRequest, NextApiResponse } from "next";
import { setTimeout } from "timers/promises";

/**
 * API handler to fetch a setlist by specific id from the Setlist.fm API.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { setlistId } = req.query;

    /**
     * Fetches a setlist from the Setlist.fm API, with retry logic for handling rate limits (429 errors).
     *
     * @param retries - The current retry attempt number.
     * @returns A Promise resolving to the API response.
     */
    async function fetchSetlist(retries: number = 0): Promise<Response> {
        const response = await fetch(`https://api.setlist.fm/rest/1.0/setlist/${setlistId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "x-api-key": process.env.SETLIST_FM_API_KEY!
            }
        });

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
                error: "errors:setlistFmSearchSetlistIdError"
            });
        }

        res.status(200).json(await response.json()); // Return the fetched setlist data
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            error: "errors:internalServerError"
        });
    }
}
