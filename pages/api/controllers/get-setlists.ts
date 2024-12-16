import { NextApiRequest, NextApiResponse } from "next";
import getBaseUrl from "../../../lib/utils/getBaseUrl";

/**
 * API handler to fetch Spotify artist details and associated setlists.
 *
 * Combines data from Spotify's API and Setlist.fm's API to provide
 * artist details and their performance setlists.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query;
    try {
        const baseUrl = getBaseUrl(req);

        // Step 1: Fetch artist details from Spotify
        const spotifyResponse = await fetch(
            `${baseUrl}/api/spotify/search-artist?${new URLSearchParams({ query: query as string }).toString()}`,
            {
                headers: {
                    cookie: req.headers.cookie || "" // Forward client cookies for access token
                }
            }
        );

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!spotifyResponse.ok) {
            const errorResponse = await spotifyResponse.json();
            return res.status(spotifyResponse.status).json({
                error: errorResponse.error
            });
        }

        const spotifyArtist = await spotifyResponse.json();

        // Step 2: Fetch the artist's mbid (MusicBrainz ID) from Setlist.fm
        const setlistfmArtistResponse = await fetch(
            `${baseUrl}/api/setlist-fm/search-artists?${new URLSearchParams({
                artistName: spotifyArtist.name,
                page: "1"
            }).toString()}`
        );

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!setlistfmArtistResponse.ok) {
            const errorResponse = await setlistfmArtistResponse.json();
            return res.status(setlistfmArtistResponse.status).json({
                error: errorResponse.error
            });
        }

        const setlistfmArtist = await setlistfmArtistResponse.json();

        // Step 3: Fetch setlists by the artist's mbid from Setlist.fm
        const setlistsResponse = await fetch(
            `${baseUrl}/api/setlist-fm/search-setlists?${new URLSearchParams({
                artistMbid: setlistfmArtist.mbid
            }).toString()}`
        );

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!setlistsResponse.ok) {
            const errorResponse = await setlistsResponse.json();
            return res.status(setlistsResponse.status).json({
                error: errorResponse.error
            });
        }

        // Return a combined response containing full artist details and their setlists
        res.status(200).json({
            spotifyArtist,
            setlistfmArtist,
            setlists: await setlistsResponse.json()
        });
    } catch (error) {
        res.status(500).json({
            error: "internalServerError"
        });
    }
}
