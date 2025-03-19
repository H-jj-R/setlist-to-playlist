/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import getBaseUrl from "@utils/getBaseUrl";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to fetch Spotify playlist details and save them to a database.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { playlistId } = req.query;

    // Ensure user is authenticated
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "common:authorisationError" });

    try {
        const baseUrl = getBaseUrl(req); // Get base URL for API requests

        /**
         * Regular expression to validate a Spotify playlist ID.
         */
        const PLAYLIST_ID_REGEX: RegExp = /^[0-9a-zA-Z]{22}$/;

        // Validate playlistId format
        if (!playlistId || !PLAYLIST_ID_REGEX.test(playlistId as string)) {
            return res.status(400).json({ error: "common:invalidParam" });
        }

        // Step 1. Fetch playlist details from Spotify API
        const playlistDetailsResponse = await fetch(`${baseUrl}/api/spotify/get-playlist?playlistId=${playlistId}`, {
            headers: { cookie: req.headers.cookie || "" } // Forward client cookies for access token
        });
        if (!playlistDetailsResponse.ok) {
            const errorResponse = await playlistDetailsResponse.json();
            return res.status(playlistDetailsResponse.status).json({ error: errorResponse.error });
        }
        const playlistDetails = await playlistDetailsResponse.json();

        // Step 2. Filter details for the database from the playlistDetails object
        const filteredPlaylistDetails = {
            description: playlistDetails.description,
            name: playlistDetails.name,
            spotifyPlaylistID: playlistDetails.id,
            tracks: playlistDetails.tracks.items.map((item: any, idx: number) => ({
                position: idx,
                songID: item.track.id
            }))
        };

        // Step 3. Send playlist details to the database API
        const savePlaylistResponse = await fetch(`${baseUrl}/api/database/save-playlist`, {
            body: JSON.stringify({ playlistDetails: filteredPlaylistDetails }),
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        if (!savePlaylistResponse.ok) {
            const errorResponse = await savePlaylistResponse.json();
            return res.status(savePlaylistResponse.status).json({ error: errorResponse.error });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
