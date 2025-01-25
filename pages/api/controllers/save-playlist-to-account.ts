import { NextApiRequest, NextApiResponse } from "next";
import getBaseUrl from "../../../lib/utils/getBaseUrl";

/**
 * API handler to fetch Spotify playlist details and save them to a database.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { playlistId } = req.query;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorised" });
    }

    try {
        const baseUrl = getBaseUrl(req);

        // 1. Fetch playlist details from Spotify API
        const playlistDetailsResponse = await fetch(`${baseUrl}/api/spotify/get-playlist?playlistId=${playlistId}`, {
            headers: {
                cookie: req.headers.cookie || "" // Forward client cookies for access token
            }
        });

        if (!playlistDetailsResponse.ok) {
            const errorResponse = await playlistDetailsResponse.json();
            return res.status(playlistDetailsResponse.status).json({
                error: errorResponse.error
            });
        }

        const playlistDetails = await playlistDetailsResponse.json();

        // TODO: Filter important details from the playlistDetails object
        // Should filter to spotifyPlaylistID, name, description, tracks
        // The tracks should be filtered to songID, and position
        const filteredPlaylistDetails = playlistDetails;

        // 2. Send playlist details to the database API
        const savePlaylistResponse = await fetch(`${baseUrl}/api/database/save-playlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                playlistDetails: filteredPlaylistDetails
            })
        });

        if (!savePlaylistResponse.ok) {
            const errorResponse = await savePlaylistResponse.json();
            return res.status(savePlaylistResponse.status).json({
                error: errorResponse.error
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            error: "errors:internalServerError"
        });
    }
}
