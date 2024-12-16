import { NextApiRequest, NextApiResponse } from "next";
import decryptToken from "../../../lib/utils/decryptToken";
import cookie from "cookie";

/**
 * API handler to add tracks to a Spotify playlist.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { playlistId, tracks } = req.body;

    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_user_access_token;

    if (!encryptedAccessToken) {
        return res.status(401).json({ error: "No access token found" });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${decryptToken(encryptedAccessToken)}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ uris: tracks })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Spotify API error body:", errorBody);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error adding tracks:", error);
        res.status(500).json({ error: error.message });
    }
}
