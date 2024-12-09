import { NextApiRequest, NextApiResponse } from "next";
import { setTimeout } from "timers/promises";

/**
 * Fetch a setlist by specifc id from the Setlist.fm API.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { setlistId } = req.query;
    const maxRetries = 5; // Maximum number of retry attempts if rate-limited
    const baseDelay = 1000; // Base delay for exponential backoff during retries

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
        if (response.status === 429 && retries < maxRetries) {
            const retryAfterHeader = response.headers.get("Retry-After"); // Check for a Retry-After header
            const retryAfter = retryAfterHeader
                ? parseInt(retryAfterHeader, 10) // Use Retry-After if provided
                : baseDelay * Math.pow(2, retries); // Otherwise, use exponential backoff
            await setTimeout(retryAfter); // Wait before retrying
            return fetchSetlist(retries + 1); // Recursive call with incremented retry count
        }

        return response;
    }

    try {
        const response = await fetchSetlist();

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!response.ok) {
            // Get the error details from the response
            const errorResponse = await response.json();
            const errorMessage = errorResponse.error?.message || "Unknown error";
            throw new Error(`${response.status}: Failed to fetch setlist - Error: ${errorMessage}`);
        }

        res.status(200).json(await response.json()); // Return the fetched setlist data
    } catch (error) {
        console.error("Error finding setlist: ", error);
        res.status(500).json({ error: error.message });
    }
}
