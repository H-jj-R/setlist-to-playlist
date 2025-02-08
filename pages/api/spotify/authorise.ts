/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { NextApiRequest, NextApiResponse } from "next";

/**
 * API route to initiate the Spotify OAuth flow.
 * Redirects the user to Spotify's authorisation page.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { redirect } = req.query;

    // Redirect the user to the Spotify authorization page
    res.redirect(
        `https://accounts.spotify.com/authorize?${new URLSearchParams({
            client_id: process.env.SPOTIFY_API_C_ID!,
            response_type: "code",
            redirect_uri: process.env.SPOTIFY_API_REDIRECT_URI!,
            state: redirect.toString(), // Pass the redirect state to identify where to redirect after authoriation
            scope: [
                "user-read-private", // Grants access to the user's information (username required for playlist creation)
                "ugc-image-upload", // Allows uploading user-generated images to Spotify
                "playlist-read-private", // Allows reading private playlists
                "playlist-read-collaborative", // Allows reading collaborative playlists
                "playlist-modify-private", // Allows modifying the user's private playlists (e.g., adding/removing tracks)
                "playlist-modify-public" // Allows modifying the user's public playlists (e.g., adding/removing tracks)
            ].join(" ")
        }).toString()}`
    );
}
