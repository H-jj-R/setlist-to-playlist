import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

/**
 * API handler to ensure the user has an access token.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const cookies = cookie.parse(req.headers.cookie || "");
        const encryptedRefreshToken = cookies.spotify_user_refresh_token;

        // If no refresh token is found in the cookies, respond with an error
        if (!encryptedRefreshToken) {
            return res.status(401).json({
                error: "spotifyAccessTokenError"
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({
            error: "internalServerError"
        });
    }
}
