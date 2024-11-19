import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import CryptoJS from "crypto-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const url = `https://accounts.spotify.com/api/token`;
        const headers = new Headers({
            "Content-Type": "application/x-www-form-urlencoded"
        });

        const body = new URLSearchParams({
            grant_type: "client_credentials",
            client_id: process.env.SPOTIFY_API_C_ID!,
            client_secret: process.env.SPOTIFY_API_C_SECRET!
        });

        const response = await fetch(url, {
            method: "POST",
            headers,
            body
        });

        if (!response.ok) {
            throw new Error(`Error fetching access token: ${response.status}`);
        }

        const { access_token, expires_in } = await response.json();
        const encryptedAccessToken = CryptoJS.AES.encrypt(access_token, process.env.ENCRYPTION_KEY!).toString();

        // Set the encrypted token as a cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("spotify_access_token", encryptedAccessToken, {
                httpOnly: true,
                secure: true, // only set secure flag in production
                maxAge: expires_in,
                path: "/"
            })
        );

        // Get the original redirect path and query parameters from the request
        const redirectPath = req.query.redirect as string;
        const query = req.query.query as string;

        if (redirectPath) {
            // Redirect back to the original path
            res.redirect(307, redirectPath + `?query=${query}`);
        } else {
            // If no redirect path, return a success message
            res.status(200).json({ message: "Access token generated and stored in cookie" });
        }
    } catch (error) {
        console.error("Error generating access token:", error);
        res.status(500).json({ error: "Failed to generate access token" });
    }
}
