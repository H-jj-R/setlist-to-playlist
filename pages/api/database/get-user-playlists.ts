import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "@constants/db";

/**
 * API handler to fetch user playlists with track details.
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

        // Fetch all playlists belonging to the user
        const [playlists] = await db.execute(
            `
            SELECT 
                p.playlist_id AS playlistId,
                p.spotify_playlist_id AS spotifyPlaylistID,
                p.playlist_name AS name,
                p.playlist_description AS description
            FROM Playlists p
            WHERE p.user_id = ? AND p.deleted = 0
            ORDER BY p.created_at DESC
            `,
            [userId]
        );

        // Fetch tracks for each playlist
        const playlistsWithTracks = await Promise.all(
            (playlists as any[]).map(async (playlist) => {
                const [tracks] = await db.execute(
                    `
                    SELECT 
                        ps.song_id AS songID,
                        ps.position AS position
                    FROM PlaylistSongs ps
                    WHERE ps.playlist_id = ?
                    ORDER BY ps.position ASC
                    `,
                    [playlist.playlistId]
                );

                return {
                    ...playlist,
                    tracks
                };
            })
        );

        res.status(200).json({ playlists: playlistsWithTracks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
