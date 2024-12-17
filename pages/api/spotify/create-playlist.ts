import { NextApiRequest, NextApiResponse } from "next";
import decryptToken from "../../../lib/utils/decryptToken";
import cookie from "cookie";

/**
 * API handler to create a playlist for a Spotify user.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId, name, description, isPrivate } = req.body;

    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_user_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) {
        return res.status(401).json({
            error: "spotifyAccessTokenError"
        });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${decryptToken(encryptedAccessToken)}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                description: description,
                public: !isPrivate
            })
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: "spotifyCreatePlaylistError"
            });
        }

        const data = await response.json();
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            error: "internalServerError"
        });
    }
}
