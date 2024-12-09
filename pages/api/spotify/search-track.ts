import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import CryptoJS from "crypto-js";

/**
 * API handler for searching an artist on Spotify using the Spotify API.
 * Requires an access token, encrypted in cookies.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { artist, track } = req.query;
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) {
        return res.status(500).json({ error: "No access token" });
    }

    const accessToken = decryptToken(encryptedAccessToken);
    const searchUrl = `https://api.spotify.com/v1/search?q=${track}+artist:${artist}&type=track&limit=5`;

    try {
        // Make a GET request to Spotify's search API
        const response = await fetch(searchUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!response.ok) {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.error?.message || "Unknown error";
            throw new Error(`${response.status}: Error searching song - Error: ${errorMessage}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // TODO: Check that track actually is the right track (better algorithm)
        // Check if there is a perfectly matching track from the top 5 results
        const trackMatch = data.tracks.items.find(
            (trackList) =>
                trackList.name.toLowerCase() === track.toString().toLowerCase() &&
                trackList.album.album_type !== "compilation"
        );

        if (trackMatch) {
            // If there's an exact match, send it
            res.status(200).json({
                ...trackMatch
            });
        } else {
            // If not, send the top result
            res.status(200).json({
                ...data.tracks.items[0]
            });
        }
    } catch (error) {
        console.error("Error searching song: ", error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * Decrypts an encrypted token using AES decryption.
 *
 * @param {string} encryptedToken - The encrypted token string.
 * @returns {string} - The decrypted token.
 */
function decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.ENCRYPTION_KEY!); // Decrypt using the encryption key from environment variables
    return bytes.toString(CryptoJS.enc.Utf8); // Convert decrypted bytes to a UTF-8 string
}
