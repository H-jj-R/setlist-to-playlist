/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { NextApiRequest, NextApiResponse } from "next";

/**
 * API route to initiate the Spotify OAuth flow.
 *
 * Redirects the user to Spotify's authorisation page.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { redirect } = req.query;

    // Redirect the user to the Spotify authorization page
    res.redirect(
        `https://accounts.spotify.com/authorize?${new URLSearchParams({
            client_id: process.env.SPOTIFY_API_C_ID!,
            redirect_uri: process.env.SPOTIFY_API_REDIRECT_URI!,
            response_type: "code",
            scope: [
                "playlist-modify-private", // Allows modifying the user's private playlists (e.g. adding/removing tracks)
                "playlist-modify-public", // Allows modifying the user's public playlists (e.g. adding/removing tracks)
                "playlist-read-collaborative", // Allows reading collaborative playlists
                "playlist-read-private", // Allows reading private playlists
                "ugc-image-upload", // Allows uploading user-generated images to Spotify
                "user-follow-read", // Read access to a user's followers and followed artists
                "user-read-private" // Grants access to the user's information (username required for playlist creation)
            ].join(" "),
            state: redirect.toString() // Pass the redirect state to identify where to redirect after authoriation
        }).toString()}`
    );
}
