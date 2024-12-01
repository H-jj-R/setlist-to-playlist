import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

/**
 * API handler to ensure the user has an access token.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const cookies = cookie.parse(req.headers.cookie || "");
        const encryptedRefreshToken = cookies.spotify_user_refresh_token;

        if (!encryptedRefreshToken) {
            res.status(401).json({ error: "No refresh token available" });
            return;
        }

        res.status(200).json({ message: "Access token valid" });
    } catch (error) {
        console.error("Error handling user token: ", error);
        res.status(500).json({ error: error.message });
    }
}
