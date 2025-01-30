import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/constants/db";
import jwt from "jsonwebtoken";

/**
 * API handler to delete a user playlist (soft delete by setting deleted to true).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "errors:methodNotAllowed" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "errors:authorisationError" });
    }

    try {
        // Verify and decode the JWT token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        const { playlistId } = req.query;
        if (!playlistId) {
            return res.status(400).json({ error: "errors:missingPlaylistId" });
        }

        // Update the playlist to set deleted = true
        const [result]: any = await db.execute(
            `
            UPDATE Playlists 
            SET deleted = 1
            WHERE playlist_id = ? AND user_id = ?
            `,
            [playlistId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "errors:playlistNotFoundOrUnauthorized" });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "errors:internalServerError" });
    }
}
