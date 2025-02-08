import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "@constants/db";

/**
 * API handler to update playlist details (name and description).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "common:methodNotAllowed" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "common:authorisationError" });
    }

    try {
        // Verify and decode the JWT token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;
        const { playlistId } = req.query;

        const { playlistName, playlistDescription } = req.body;

        if (!playlistId || !playlistName) {
            return res.status(400).json({ error: "userPlaylists:missingParameters" });
        }

        // Update the playlist details in the database
        const [result] = await db.execute(
            `
            UPDATE Playlists
            SET playlist_name = ?, playlist_description = ?
            WHERE playlist_id = ? AND user_id = ?
            `,
            [playlistName, playlistDescription || "", playlistId, userId]
        );

        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ error: "userPlaylists:playlistNotFound" });
        }

        res.status(200).json({ sucess: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
