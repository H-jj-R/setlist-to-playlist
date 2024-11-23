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
        const url = `https://accounts.spotify.com/api/token`;
        const headers = new Headers({
            "Content-Type": "application/x-www-form-urlencoded"
        });

        const body = new URLSearchParams({
            grant_type: "client_credentials",
            client_id: process.env.SPOTIFY_API_C_ID!,
            client_secret: process.env.SPOTIFY_API_C_SECRET!
        });

        // Fetch access token from Spotify
        const response = await fetch(url, {
            method: "POST",
            headers,
            body
        });

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!response.ok) {
            // Get the error details from the response
            const errorResponse = await response.json();
            const errorMessage = errorResponse.error?.message || "Unknown error";
            throw new Error(
                `${response.status}: Error fetching access token - Error: ${errorMessage}`
            );
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
        const redirectPath = req.query.redirect as string;
        const query = req.query.query as string;

        if (redirectPath) {
            // If a redirect path is provided, redirect back to that path with the query parameter
            res.redirect(307, redirectPath + `?query=${query}`);
        } else {
            // If no redirect path is provided, respond with a success message
            res.status(200).json({ message: "Access token generated and stored in cookie" });
        }
    } catch (error) {
        // Log any errors and respond with a 500 status
        console.error("Error generating access token: ", error);
        res.status(500).json({ error: "Failed to generate access token" });
    }
}
