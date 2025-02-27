/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import decryptToken from "@utils/decryptToken";
import * as cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler for searching an artist on Spotify using the Spotify API.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query;
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) return res.status(401).json({ error: "common:spotifyAccessTokenError" });

    try {
        // Make a GET request to Spotify's search API
        const response = await fetch(
            `https://api.spotify.com/v1/search?${new URLSearchParams({
                limit: "1",
                q: query as string,
                type: "artist"
            }).toString()}`,
            {
                headers: { Authorization: `Bearer ${decryptToken(encryptedAccessToken)}` },
                method: "GET"
            }
        );
        if (!response.ok) return res.status(response.status).json({ error: "setlistSearch:spotifySearchArtistError" });
        const data = await response.json();

        // Check if the artist was found; if not, throw an error
        if (data.artists.items.length === 0) {
            return res.status(404).json({ error: "setlistSearch:spotifySearchArtistError" });
        }

        res.status(200).json(data.artists.items[0]); // Respond with the first artist's (best match) data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
