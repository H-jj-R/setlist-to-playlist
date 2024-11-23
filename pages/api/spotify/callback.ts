import { NextApiRequest, NextApiResponse } from "next";
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
        res.status(400).json({ error: "No code provided" });
        return;
    }

    try {
        const baseUrl = getBaseUrl(req);

        // Create parameters for the token request
        const params = new URLSearchParams();
        params.append("client_id", process.env.SPOTIFY_API_C_ID!);
        params.append("client_secret", process.env.SPOTIFY_API_C_SECRET!);
        params.append("grant_type", "authorization_code");
        params.append("code", code as string);
        params.append("redirect_uri", process.env.SPOTIFY_API_REDIRECT_URI!);

        // Make a POST request to Spotify's token endpoint to exchange the authorisation code for tokens
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!response.ok) {
            // Get the error details from the response
            const errorResponse = await response.json();
            const errorMessage = errorResponse.error?.message || "Unknown error";
            throw new Error(
                `${response.status}: Failed to exchange authorisation code for access token - Error: ${errorMessage}`
            );
        }

        const data = await response.json();

        // Encrypt the access token using AES encryption
        const encryptedAccessToken = CryptoJS.AES.encrypt(data.access_token, process.env.ENCRYPTION_KEY!).toString();
        const encryptedRefreshToken = CryptoJS.AES.encrypt(data.refresh_token, process.env.ENCRYPTION_KEY!).toString();

        // Set the encrypted access token as a secure HTTP-only cookie
        res.setHeader("Set-Cookie", [
            // Access token cookie
            cookie.serialize("spotify_user_access_token", encryptedAccessToken, {
                httpOnly: true,
                secure: true,
                maxAge: data.expires_in,
                path: "/"
            }),
            // Refresh token cookie
            cookie.serialize("spotify_user_refresh_token", encryptedRefreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 2147483646,
                path: "/"
            })
        ]);

        // Redirect the user to the original state URL or the home page if none provided
        const redirectUrl = state ? `${baseUrl}${decodeURIComponent(state as string)}` : "/";
        res.redirect(redirectUrl);
    } catch (error) {
        console.error("Error in callback: ", error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * Utility function to construct the base URL of the server.
 *
 * @param {NextApiRequest} req - The API request object.
 * @returns {string} - The base URL string.
 */
function getBaseUrl(req: NextApiRequest): string {
    const protocol = req.headers["x-forwarded-proto"] || "http"; // Determine the protocol (HTTP or HTTPS)
    const host = req.headers.host!; // Get the host from headers
    return `${protocol}://${host}`; // Construct and return the base URL
}
