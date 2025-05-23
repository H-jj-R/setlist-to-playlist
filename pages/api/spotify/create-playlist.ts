/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import decryptToken from "@utils/decryptToken";
import * as cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to create a playlist for a Spotify user.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { description, name, userId } = req.body;
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_user_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) return res.status(401).json({ error: "common:spotifyAccessTokenError" });

    /**
     * Regular expression to validate Spotify user ID.
     */
    const USER_ID_REGEX = /^[0-9a-zA-Z_-]+$/;

    // Validate userId format
    if (!userId || !USER_ID_REGEX.test(userId as string)) {
        return res.status(400).json({ error: "common:invalidParam" });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            body: JSON.stringify({
                description: description,
                name: name
            }),
            headers: {
                Authorization: `Bearer ${decryptToken(encryptedAccessToken)}`,
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        if (!response.ok) {
            return res.status(response.status).json({ error: "exportSetlist:spotifyCreatePlaylistError" });
        }
        const data = await response.json();

        res.status(200).json({ data: data, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
