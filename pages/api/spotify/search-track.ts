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
    const { artist, track } = req.query;
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) {
        return res.status(401).json({ error: "common:spotifyAccessTokenError" });
    }

    const accessToken = decryptToken(encryptedAccessToken);
    const searchParams = new URLSearchParams({
        limit: "5",
        q: `${track} artist:${artist}`,
        type: "track"
    }).toString();

    const searchTrack = async (retries = 3): Promise<void> => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?${searchParams}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                method: "GET"
            });

            if (response.status === 429 && retries > 0) {
                // Get the retry-after value (in seconds) from headers
                const retryAfter = parseInt(response.headers.get("Retry-After"), 10) || 5;
                await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
                return searchTrack(retries - 1); // Retry the request
            }
            if (!response.ok) {
                return res.status(response.status).json({ error: "exportSetlist:spotifySearchTrackError" });
            }
            const data = await response.json();

            // Check if there is a perfectly matching track from the top 5 results
            const trackMatch = data.tracks.items.find(
                (trackList): boolean =>
                    trackList.name.toLowerCase() === track.toString().toLowerCase() &&
                    trackList.album.album_type !== "compilation"
            );
            if (trackMatch) {
                // If there's an exact match, send it
                res.status(200).json({ ...trackMatch });
            } else {
                // If not, send the top result
                res.status(200).json({ ...data.tracks.items[0] });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "common:internalServerError" });
        }
    };

    await searchTrack();
}
