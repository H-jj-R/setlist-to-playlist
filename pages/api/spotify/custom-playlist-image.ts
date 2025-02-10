/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import decryptToken from "@utils/decryptToken";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to add a custom image to a playlist.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { image, playlistId } = req.body;

    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_user_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) {
        return res.status(401).json({
            error: "common:spotifyAccessTokenError"
        });
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

        if (!response.ok) {
            return res.status(response.status).json({
                error: "exportSetlist:spotifyAddImageError"
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "common:internalServerError"
        });
    }
}
