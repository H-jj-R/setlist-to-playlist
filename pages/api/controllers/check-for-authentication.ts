/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to ensure the user has an access token.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Don't require Spotify authentication if in test environment
        if (!process.env.NEXT_PUBLIC_APP_ENV?.includes("test")) {
            // Get the encrypted refresh token from cookies
            const cookies = cookie.parse(req.headers.cookie || "");
            const encryptedRefreshToken = cookies.spotify_user_refresh_token;

            // If no refresh token is found in the cookies, respond with an error
            if (!encryptedRefreshToken) return res.status(401).json({ error: "common:spotifyAccessTokenError" });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
