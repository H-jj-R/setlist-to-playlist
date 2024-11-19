import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import CryptoJS from "crypto-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query;
    const cookies = cookie.parse(req.headers.cookie || "");
    let encryptedAccessToken = cookies.spotify_access_token;

    // If no token in cookie, generate a new one
    if (!encryptedAccessToken) {
        
            return res.status(500).json({ error: "No access token"});
        
    }

    const accessToken = decryptToken(encryptedAccessToken);
    const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=1`;

    try {
        const response = await fetch(searchUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.artists.items.length === 0) {
            throw new Error("Artist not found");
        }

        res.status(200).json(data.artists.items[0]);
    } catch (error) {
        console.error("Error searching artist:", error);
        res.status(500).json({ error: error.message });
    }
}

function decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_KEY!);
    return bytes.toString(CryptoJS.enc.Utf8);
}

function getBaseUrl(req: NextApiRequest): string {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host!;
    return `${protocol}://${host}`;
}
