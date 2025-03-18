/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import decryptToken from "@utils/decryptToken";
import * as cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to add a custom image to a playlist.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { image, playlistId } = req.body;
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_user_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) return res.status(401).json({ error: "common:spotifyAccessTokenError" });

    /**
     * Regular expression to validate a Spotify playlist ID.
     */
    const PLAYLIST_ID_REGEX: RegExp = /^[0-9a-zA-Z]{22}$/;

    // Validate playlistId format
    if (!playlistId || !PLAYLIST_ID_REGEX.test(playlistId as string)) {
        return res.status(400).json({ error: "common:invalidParam" });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
            body: image.replace(/^data:image\/\w+;base64,/, ""),
            headers: {
                Authorization: `Bearer ${decryptToken(encryptedAccessToken)}`,
                "Content-Type": "image/jpeg"
            },
            method: "PUT"
        });
        if (!response.ok) return res.status(response.status).json({ error: "exportSetlist:spotifyAddImageError" });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
