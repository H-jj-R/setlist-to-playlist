import { NextApiRequest, NextApiResponse } from "next";
import decryptToken from "../../../lib/utils/decryptToken";
import cookie from "cookie";

/**
 * API handler for searching an artist on Spotify using the Spotify API.
 * Requires an access token, encrypted in cookies.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query;
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_access_token;

    // If no access token is found in the cookies, respond with an error
    if (!encryptedAccessToken) {
        return res.status(500).json({
            error: "spotifyAccessTokenError"
        });
    }

    try {
        // Make a GET request to Spotify's search API
        const response = await fetch(
            `https://api.spotify.com/v1/search?${new URLSearchParams({
                q: query as string,
                type: "artist",
                limit: "1"
            }).toString()}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${decryptToken(encryptedAccessToken)}`
                }
            }
        );

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!response.ok) {
            return res.status(response.status).json({
                error: "spotifySearchArtistError"
            });
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the artist was found; if not, throw an error
        if (data.artists.items.length === 0) {
            return res.status(404).json({
                error: "spotifySearchArtistError"
            });
        }

        // Respond with the first artist's (best match) data
        res.status(200).json(data.artists.items[0]);
    } catch (error) {
        res.status(500).json({
            error: "internalServerError"
        });
    }
}
