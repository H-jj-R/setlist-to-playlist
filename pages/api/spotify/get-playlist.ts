/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import decryptToken from "@utils/decryptToken";

/**
 * API handler to fetch full details of a Spotify playlist.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { playlistId } = req.query;
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_user_access_token;

    if (!encryptedAccessToken) {
        return res.status(401).json({
            error: "common:spotifyAccessTokenError"
        });
    }

    try {
        const accessToken = decryptToken(encryptedAccessToken);

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: "common:spotifyFetchPlaylistError",
                message: await response.json()
            });
        }

        const playlistDetails = await response.json();
        res.status(200).json(playlistDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "common:internalServerError"
        });
    }
}
