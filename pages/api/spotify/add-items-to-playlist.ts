/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import decryptToken from "@utils/decryptToken";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to add tracks to a Spotify playlist.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { playlistId, tracks } = req.body;
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_user_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) return res.status(401).json({ error: "common:spotifyAccessTokenError" });

    try {
        // Parse track data and extract only the track URIs
        const parsedTracks = JSON.parse(tracks);
        const trackUris: string[] = parsedTracks.filter((track) => track && track.uri).map((track) => track.uri);

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            body: JSON.stringify({ uris: trackUris }),
            headers: {
                Authorization: `Bearer ${decryptToken(encryptedAccessToken)}`,
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        if (!response.ok) return res.status(response.status).json({ error: "exportSetlist:spotifyAddItemsError" });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
