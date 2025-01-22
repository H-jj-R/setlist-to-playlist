import { NextApiRequest, NextApiResponse } from "next";
import decryptToken from "../../../lib/utils/decryptToken";
import cookie from "cookie";

/**
 * API handler to get an authenticated user's data.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_user_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) {
        return res.status(401).json({
            error: "errors:spotifyAccessTokenError"
        });
    }

    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${decryptToken(encryptedAccessToken)}`
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: "errors:spotifyGetUserDataError"
            });
        }

        const userData = await response.json();
        res.status(200).json({
            ...userData
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            error: "errors:internalServerError"
        });
    }
}
