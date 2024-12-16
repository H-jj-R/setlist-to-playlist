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

    if (!encryptedAccessToken) {
        return res.status(401).json({ error: "No access token found" });
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
            const errorResponse = await response.json();
            throw new Error(
                `${response.status}: Failed to create playlist - Error: ${
                    errorResponse.message || "Unknown error"
                }`
            );
        }

        const data = await response.json();
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({ error: error.message });
    }
}
