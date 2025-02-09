/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import getBaseUrl from "@utils/getBaseUrl";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to export a chosen setlist to a Spotify playlist, with customisation.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name, description, image, tracks, isLoggedIn } = req.body;
    try {
        let issue;
        const baseUrl = getBaseUrl(req);

        // 1. Get user data
        const userDataResponse = await fetch(`${baseUrl}/api/spotify/get-user-data`, {
            headers: {
                cookie: req.headers.cookie || "" // Forward client cookies for access token
            }
        });

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!userDataResponse.ok) {
            const errorResponse = await userDataResponse.json();
            return res.status(userDataResponse.status).json({
                error: errorResponse.error
            });
        }

        const userData = await userDataResponse.json();

        // 2. Create playlist
        const createPlaylistResponse = await fetch(`${baseUrl}/api/spotify/create-playlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: req.headers.cookie || "" // Forward client cookies for access token
            },
            body: JSON.stringify({
                userId: userData.id,
                name: name,
                description: description
            })
        });

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!createPlaylistResponse.ok) {
            const errorResponse = await createPlaylistResponse.json();
            return res.status(createPlaylistResponse.status).json({
                error: errorResponse.error
            });
        }

        const playlistData = await createPlaylistResponse.json();

        // 3. Add songs to playlist
        const addItemsResponse = await fetch(`${baseUrl}/api/spotify/add-items-to-playlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: req.headers.cookie || "" // Forward client cookies for access token
            },
            body: JSON.stringify({
                playlistId: playlistData.data.id,
                tracks: tracks
            })
        });

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!addItemsResponse.ok) {
            const errorResponse = await addItemsResponse.json();
            return res.status(addItemsResponse.status).json({
                error: errorResponse.error
            });
        }

        // 4. Add cover image (if provided)
        if (image) {
            const addCoverImageResponse = await fetch(`${baseUrl}/api/spotify/custom-playlist-image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    cookie: req.headers.cookie || "" // Forward client cookies for access token
                },
                body: JSON.stringify({
                    playlistId: playlistData.data.id,
                    image: image
                })
            });

            // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
            if (!addCoverImageResponse.ok) {
                const errorResponse = await addCoverImageResponse.json();
                issue += errorResponse.error;
            }
        }

        // 5. Save playlist to user's account (if logged in)
        if (isLoggedIn) {
            const token = req.headers.authorization?.split(" ")[1];
            const savePlaylistResponse = await fetch(
                `${baseUrl}/api/controllers/save-playlist-to-account?playlistId=${playlistData.data.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        cookie: req.headers.cookie || "" // Forward client cookies for access token
                    }
                }
            );

            // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
            if (!savePlaylistResponse.ok) {
                const errorResponse = await savePlaylistResponse.json();
                issue += errorResponse.error;
            }
        }

        res.status(200).json({ success: true, issue: issue });
    } catch (error) {
        res.status(500).json({
            error: "common:internalServerError"
        });
    }
}
