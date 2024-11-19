import { NextApiRequest, NextApiResponse } from "next";
import CryptoJS from "crypto-js";

const clientId = process.env.SPOTIFY_API_C_ID;
const clientSecret = process.env.SPOTIFY_API_C_SECRET;
const redirectUri = process.env.SPOTIFY_API_REDIRECT_URI;

/**
 * API handler for Spotify callback
 * @param req
 * @param res
 * @returns
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const baseUrl = getBaseUrl(req);

    if (!code) {
        res.status(400).json({ error: "No code provided" });
        return;
    }

    try {
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("client_secret", clientSecret);
        params.append("grant_type", "authorization_code");
        params.append("code", code as string);
        params.append("redirect_uri", redirectUri);

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        if (!result.ok) {
            throw new Error("Failed to refresh access token");
        }

        const data = await result.json();

        const encryptedAccessToken = CryptoJS.AES.encrypt(data.access_token, process.env.ENCRYPTION_KEY).toString();
        const encryptedRefreshToken = CryptoJS.AES.encrypt(data.refresh_token, process.env.ENCRYPTION_KEY).toString();

        res.setHeader("Set-Cookie", [
            `spotify_user_access_token=${encryptedAccessToken}; HttpOnly; Secure; Max-Age=${data.expires_in}; Path=/`,
            `spotify_user_refresh_token=${encryptedRefreshToken}; HttpOnly; Secure; Max-Age=2147483646; Path=/`
        ]);

        const redirectUrl = state ? `${baseUrl}${decodeURIComponent(state as string)}` : "/";
        res.redirect(redirectUrl);
    } catch (error) {
        console.error("Error in callback:", error);
        res.status(500).json({ error: error.message });
    }
}

const getBaseUrl = (req: NextApiRequest) => {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    return `${protocol}://${host}`;
};
