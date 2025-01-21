import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import CryptoJS from "crypto-js";

/**
 * API handler to generate and store a Spotify API access token.
 *
 * This handler fetches a client credentials token from Spotify, encrypts it,
 * and stores it in a secure cookie. Optionally, it redirects back to a given path if provided.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.SPOTIFY_API_C_ID!,
                client_secret: process.env.SPOTIFY_API_C_SECRET!
            })
        });

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!response.ok) {
            return res.status(response.status).json({
                error: "errors:spotifyGenerateAccessTokenError"
            });
        }

        // Extract the access token and expiration time from the response
        const { access_token, expires_in } = await response.json();

        // Encrypt the access token using AES encryption
        const encryptedAccessToken = CryptoJS.AES.encrypt(access_token, process.env.ENCRYPTION_KEY!).toString();

        // Set the encrypted access token as a secure HTTP-only cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("spotify_access_token", encryptedAccessToken, {
                httpOnly: true,
                secure: true,
                maxAge: expires_in,
                path: "/"
            })
        );

        // Extract the original redirect path and optional query parameter from the request
        if (req.query.redirect) {
            res.redirect(
                307,
                `${req.query.redirect as string}?${new URLSearchParams({
                    query: req.query.query as string
                }).toString()}`
            );
        } else {
            // If no redirect path is provided, respond with a success message
            res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            error: "errors:internalServerError"
        });
    }
}
