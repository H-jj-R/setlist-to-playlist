/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to save Spotify playlist details into the database.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure the request method is POST
    if (req.method !== "POST") return res.status(405).json({ error: "common:methodNotAllowed" });

    // Extract the token from the Authorization header and verify it exists
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "common:authorisationError" });

    const { playlistDetails } = req.body;

    try {
        // Verify and decode the JWT token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        const { description, name, spotifyPlaylistID, tracks } = playlistDetails;

        // Connect to database through pool
        const dbConn = await db.getConnection();

        // Insert playlist into the Playlists table
        const [playlistResult] = await dbConn.execute(
            "INSERT INTO Playlists (user_id, spotify_playlist_id, playlist_name, playlist_description) VALUES (?, ?, ?, ?)",
            [userId, spotifyPlaylistID, name, description]
        );

        const playlistId = (playlistResult as any).insertId;

        // Insert tracks into the Tracks table
        for (const track of tracks) {
            const { position, songID } = track;
            await dbConn.execute("INSERT INTO PlaylistSongs (playlist_id, song_id, position) VALUES (?, ?, ?)", [
                playlistId,
                songID,
                position
            ]);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
