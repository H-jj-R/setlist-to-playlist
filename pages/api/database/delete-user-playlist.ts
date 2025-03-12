/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to delete a user playlist (soft delete by setting deleted to true).
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

    try {
        // Verify and decode the JWT token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        // Validate playlist ID is provided
        const { playlistId } = req.query;
        if (!playlistId) return res.status(400).json({ error: "userPlaylists:missingParameters" });

        // Connect to database through pool
        const dbConn = await db.getConnection();

        // Update the playlist to set deleted = true
        const [result]: any = await dbConn.execute(
            `
            UPDATE Playlists 
            SET deleted = 1
            WHERE playlist_id = ? AND user_id = ?
            `,
            [playlistId, userId]
        );

        // Check if the playlist was found
        if (result.affectedRows === 0) return res.status(404).json({ error: "userPlaylists:playlistNotFound" });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
