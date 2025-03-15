/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to update playlist details (name and description).
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

        const { playlistId } = req.query;
        const { playlistDescription, playlistName } = req.body;

        // Verify required params are provided
        if (!playlistId || !playlistName) return res.status(400).json({ error: "userPlaylists:missingParameters" });

        // Update the playlist details in the database
        const [result]: any = await db.query(
            `
            UPDATE Playlists
            SET playlist_name = ?, playlist_description = ?
            WHERE playlist_id = ? AND user_id = ?
            `,
            [playlistName, playlistDescription || "", playlistId, userId]
        );

        // Check if the playlist was found
        if (result.affectedRows === 0) return res.status(404).json({ error: "userPlaylists:playlistNotFound" });

        res.status(200).json({ sucess: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
