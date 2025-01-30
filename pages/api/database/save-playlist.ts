import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/constants/db";
import jwt from "jsonwebtoken";

/**
 * API handler to save Spotify playlist details into the database.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "errors:methodNotAllowed" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "errors:authorisationError" });
    }

    const { playlistDetails } = req.body;

    try {
        // Verify and decode the JWT token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        const { spotifyPlaylistID, name, description, tracks } = playlistDetails;

        // Insert playlist into the Playlists table
        const [playlistResult] = await db.execute(
            "INSERT INTO Playlists (user_id, spotify_playlist_id, playlist_name, playlist_description) VALUES (?, ?, ?, ?)",
            [userId, spotifyPlaylistID, name, description]
        );

        const playlistId = (playlistResult as any).insertId;

        // Insert tracks into the Tracks table
        for (const track of tracks) {
            const { songID, position } = track;
            await db.execute("INSERT INTO PlaylistSongs (playlist_id, song_id, position) VALUES (?, ?, ?)", [
                playlistId,
                songID,
                position
            ]);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "errors:internalServerError" });
    }
}
