import { NextApiRequest, NextApiResponse } from "next";
import getBaseUrl from "../../../lib/utils/getBaseUrl";
import cookie from "cookie";
import CryptoJS from "crypto-js";

/**
 * API route to handle Spotify OAuth callback.
 *
 * This endpoint exchanges an authorisation code for an access token and refresh token,
 * encrypts them, and stores them in secure cookies, then redirects the user to a specified URL.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code || null;
    const state = req.query.state || null;

    // If no authorisation code is provided, return a 400 error
    if (!code) {
        return res.status(400).json({
            error: "spotifyCallbackError"
        });
    }

    try {
        const baseUrl = getBaseUrl(req);

        // Make a POST request to Spotify's token endpoint to exchange the authorisation code for tokens
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.SPOTIFY_API_C_ID!,
                client_secret: process.env.SPOTIFY_API_C_SECRET!,
                grant_type: "authorization_code",
                code: code as string,
                redirect_uri: process.env.SPOTIFY_API_REDIRECT_URI!
            }).toString()
        });

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!response.ok) {
            return res.status(response.status).json({
                error: "spotifyCallbackError"
            });
        }

        const data = await response.json();

        // Set the encrypted access token and refresh token as a secure cookies
        res.setHeader("Set-Cookie", [
            // Access token cookie
            cookie.serialize(
                "spotify_user_access_token",
                CryptoJS.AES.encrypt(data.access_token, process.env.ENCRYPTION_KEY!).toString(),
                {
                    httpOnly: true,
                    secure: true,
                    maxAge: data.expires_in,
                    path: "/"
                }
            ),
            // Refresh token cookie
            cookie.serialize(
                "spotify_user_refresh_token",
                CryptoJS.AES.encrypt(data.refresh_token, process.env.ENCRYPTION_KEY!).toString(),
                {
                    httpOnly: true,
                    secure: true,
                    maxAge: 2147483646,
                    path: "/"
                }
            )
        ]);

        // Redirect the user to the original state URL or the home page if none provided
        res.redirect(state ? `${baseUrl}${decodeURIComponent(state as string)}` : baseUrl);
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            error: "internalServerError"
        });
    }
}
