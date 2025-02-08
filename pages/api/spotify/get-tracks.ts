import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import decryptToken from "@utils/decryptToken";

/**
 * API handler to fetch details of multiple Spotify tracks by their IDs.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query: trackIds } = req.query;
    const cookies = cookie.parse(req.headers.cookie || "");
    const encryptedAccessToken = cookies.spotify_access_token;

    if (!encryptedAccessToken) {
        return res.status(401).json({
            error: "common:spotifyAccessTokenError"
        });
    }

    if (!trackIds) {
        return res.status(400).json({
            error: "userPlaylists:missingTrackIds"
        });
    }

    try {
        const accessToken = decryptToken(encryptedAccessToken);
        const trackIdsParam = Array.isArray(trackIds) ? trackIds.join(",") : trackIds;

        const response = await fetch(`https://api.spotify.com/v1/tracks?ids=${trackIdsParam}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: "common:spotifyFetchTracksError",
                message: await response.json()
            });
        }

        const trackDetails = await response.json();
        res.status(200).json(trackDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "common:internalServerError"
        });
    }
}
