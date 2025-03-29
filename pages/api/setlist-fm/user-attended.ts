/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { NextApiRequest, NextApiResponse } from "next";
import { setTimeout } from "timers/promises";

/**
 * API handler to search for setlists by user ID.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { page = 1, userId } = req.query;

    /**
     * Regular expression to validate a valid user ID.
     */
    const VALID_USERID_REGEX: RegExp = /^[\p{L}\p{N}\s\-_.'/&!?@#*+%:]+$/u;

    // Validate user ID format
    if (!userId || !VALID_USERID_REGEX.test(userId as string)) {
        return res.status(400).json({ error: "common:queryNotAllowed" });
    }

    /**
     * Fetches user setlists from the Setlist.fm API, with retry logic for handling rate limits (429 errors).
     *
     * @param retries - The current retry attempt number.
     * @returns A Promise resolving to the API response.
     */
    async function fetchSetlists(retries: number = 0): Promise<Response> {
        const response = await fetch(
            `https://api.setlist.fm/rest/1.0/user/${userId}/attended?${new URLSearchParams({
                p: page as string
            }).toString()}`,
            {
                headers: {
                    Accept: "application/json",
                    "x-api-key": process.env.SETLIST_FM_API_KEY!
                },
                method: "GET"
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
            return fetchSetlists(retries + 1); // Recursive call with incremented retry count
        }

        return response;
    }

    try {
        const response = await fetchSetlists();
        if (!response.ok) return res.status(response.status).json({ error: "common:internalServerError" });
        const data = await response.json();

        // If no setlists are found, return an empty object
        if (!data.setlist || data.setlist.length === 0) return res.status(200).json({});
        res.status(200).json({ setlists: data, userId: userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
