import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import decryptToken from "@utils/decryptToken";

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
        return res.status(401).json({
            error: "common:spotifyAccessTokenError"
        });
    }

    try {
        // Make a GET request to Spotify's search API
        const response = await fetch(
            `https://api.spotify.com/v1/search?${new URLSearchParams({
                q: `${track} artist:${artist}`,
                type: "track",
                limit: "5"
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
                error: "exportSetlist:spotifySearchTrackError"
            });
        }

        // Parse the JSON response
        const data = await response.json();

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
        console.error(error);
        res.status(500).json({
            error: "common:internalServerError"
        });
    }
}
