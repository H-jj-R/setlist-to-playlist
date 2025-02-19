/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import getBaseUrl from "@utils/getBaseUrl";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to recover a user's previously created playlist as a Spotify playlist.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { description, name, tracks } = req.body;
    try {
        const baseUrl = getBaseUrl(req); // Get base URL for API requests

        // Step 1. Get Spotify user data
        const userDataResponse = await fetch(`${baseUrl}/api/spotify/get-user-data`, {
            headers: { cookie: req.headers.cookie || "" } // Forward client cookies for access token
        });
        if (!userDataResponse.ok) {
            const errorResponse = await userDataResponse.json();
            return res.status(userDataResponse.status).json({ error: errorResponse.error });
        }
        const userData = await userDataResponse.json();

        // Step 2. Create new, empty Spotify playlist
        const createPlaylistResponse = await fetch(`${baseUrl}/api/spotify/create-playlist`, {
            body: JSON.stringify({
                description: description,
                name: name,
                userId: userData.id
            }),
            headers: {
                "Content-Type": "application/json",
                cookie: req.headers.cookie || "" // Forward client cookies for access token
            },
            method: "POST"
        });
        if (!createPlaylistResponse.ok) {
            const errorResponse = await createPlaylistResponse.json();
            return res.status(createPlaylistResponse.status).json({ error: errorResponse.error });
        }
        const playlistData = await createPlaylistResponse.json();

        // Step 3. Add all songs to Spotify playlist
        const addItemsResponse = await fetch(`${baseUrl}/api/spotify/add-items-to-playlist`, {
            body: JSON.stringify({
                playlistId: playlistData.data.id,
                tracks: tracks
            }),
            headers: {
                "Content-Type": "application/json",
                cookie: req.headers.cookie || "" // Forward client cookies for access token
            },
            method: "POST"
        });
        if (!addItemsResponse.ok) {
            const errorResponse = await addItemsResponse.json();
            return res.status(addItemsResponse.status).json({ error: errorResponse.error });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
