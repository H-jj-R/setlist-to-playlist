import { NextApiRequest, NextApiResponse } from "next";
import decryptToken from "../../../lib/utils/decryptToken";
import cookie from "cookie";

/**
 * API handler to add a custom image to a playlist.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { playlist_id, image } = req.body;

    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_user_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) {
        return res.status(401).json({
            error: "spotifyAccessTokenError"
        });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/images`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${decryptToken(encryptedAccessToken)}`,
                "Content-Type": "image/jpeg"
            },
            body: image
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: "spotifyAddImageError"
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
