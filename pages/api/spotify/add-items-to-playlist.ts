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
        return res.status(401).json({
            error: "spotifyAccessTokenError"
        });
    }

    try {
        const parsedTracks = JSON.parse(tracks);
        const trackUris: string[] = parsedTracks.filter((track) => track && track.uri).map((track) => track.uri);

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${decryptToken(encryptedAccessToken)}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ uris: trackUris })
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: "spotifyAddItemsError"
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            error: "internalServerError"
        });
    }
}
