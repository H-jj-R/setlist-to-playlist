import { NextApiRequest, NextApiResponse } from "next";
import decryptToken from "../../../lib/utils/decryptToken";
import cookie from "cookie";
import CryptoJS from "crypto-js";

/**
 * Refreshes the Spotify access token using the provided refresh token.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const cookies = cookie.parse(req.headers.cookie || "");
        const encryptedRefreshToken = cookies.spotify_user_refresh_token;
        const refreshToken = decryptToken(encryptedRefreshToken);

        const params = new URLSearchParams();
        params.append("client_id", process.env.SPOTIFY_API_C_ID!);
        params.append("client_secret", process.env.SPOTIFY_API_C_SECRET!);
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken);

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.error?.message || "Unknown error";
            throw new Error(`${response.status}: Error refreshing access token - Error: ${errorMessage}`);
        }

        const data = await response.json();
        const newAccessToken = CryptoJS.AES.encrypt(data.access_token, process.env.ENCRYPTION_KEY!).toString();

        // Set the new access token cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("spotify_user_access_token", newAccessToken, {
                httpOnly: true,
                secure: true,
                maxAge: data.expires_in,
                path: "/"
            })
        );

        // Extract the original redirect path and optional query parameter from the request
        const redirectPath = req.query.redirect as string;

        if (redirectPath) {
            // If a redirect path is provided, redirect back to that path with the query parameter
            res.redirect(307, redirectPath);
        } else {
            // If no redirect path is provided, respond with a success message
            res.status(200).json({ message: "Access token refreshed" });
        }
    } catch (error) {
        console.error("Error refreshing token: ", error);
        res.status(500).json({ error: error.message });
    }
}
