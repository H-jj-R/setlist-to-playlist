/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import decryptToken from "@utils/decryptToken";
import * as cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to fetch details of multiple Spotify tracks by their IDs.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query: trackIds } = req.query;
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) return res.status(401).json({ error: "common:spotifyAccessTokenError" });

    // Ensure track IDs are provided in the request
    if (!trackIds) return res.status(400).json({ error: "userPlaylists:missingTrackIds" });

    try {
        const accessToken = decryptToken(encryptedAccessToken);

        // Convert track IDs to a comma-separated string (if an array is received)
        const trackIdsParam = Array.isArray(trackIds) ? trackIds.join(",") : trackIds;

        const response = await fetch(`https://api.spotify.com/v1/tracks?ids=${trackIdsParam}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            method: "GET"
        });
        if (!response.ok) return res.status(response.status).json({ error: "common:spotifyFetchTracksError" });
        const trackDetails = await response.json();

        res.status(200).json(trackDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
