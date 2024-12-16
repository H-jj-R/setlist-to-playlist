import { NextApiRequest, NextApiResponse } from "next";
import decryptToken from "../../../lib/utils/decryptToken";
import cookie from "cookie";

/**
 * API handler to get an authenticated user's data.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_user_access_token;

    if (!encryptedAccessToken) {
        return res.status(401).json({ error: "No access token found" });
    }

    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${decryptToken(encryptedAccessToken)}`
            }
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(
                `${response.status}: Failed to get user data - Error: ${
                    errorResponse.error?.message || "Unknown error"
                }`
            );
        }

        const userData = await response.json();
        res.status(200).json({
            ...userData
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: error.message });
    }
}
