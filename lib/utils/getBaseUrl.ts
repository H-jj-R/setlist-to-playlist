/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { NextApiRequest } from "next";

/**
 * Utility function to construct the base URL of the server.
 *
 * @param {NextApiRequest} req - The API request object.
 * @returns {string} The base URL string.
 */
export default function getBaseUrl(req: NextApiRequest): string {
    const protocol = req.headers["x-forwarded-proto"] || "http"; // Determine the protocol being used
    if (!["http", "https"].includes(protocol as string)) return; // Only allow http and https
    const host = req.headers.host!; // Get the host from req headers
    return `${protocol}://${host}`; // Construct and return the base URL
}
