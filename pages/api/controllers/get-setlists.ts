/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import getBaseUrl from "@utils/getBaseUrl";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to fetch Spotify artist details and associated setlists.
 *
 * Combines data from Spotify's API and Setlist.fm's API to provide
 * artist details and their performance setlists.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { country, query } = req.query;
    try {
        const baseUrl = getBaseUrl(req); // Get base URL for API requests

        /**
         * Regular expression to validate a valid query.
         */
        const VALID_QUERY_REGEX: RegExp =
            /^[\p{L}\p{N}\s\-_.'/&!?@#*+%:\u00a9\u00ae\u2000-\u3300\ud83c\ud000-\udfff\ud83d\ud000-\udfff\ud83e\ud000-\udfff]+$/u;

        // Validate query format
        if (!query || !VALID_QUERY_REGEX.test(query as string)) {
            return res.status(400).json({ error: "common:queryNotAllowed" });
        }

        // Step 1: Fetch artist details from Spotify
        const spotifyResponse = await fetch(
            `${baseUrl}/api/spotify/search-artist?${new URLSearchParams({ query: query as string }).toString()}`,
            { headers: { cookie: req.headers.cookie || "" } } // Forward client cookies for access token
        );
        if (!spotifyResponse.ok) {
            const errorResponse = await spotifyResponse.json();
            return res.status(spotifyResponse.status).json({ error: errorResponse.error });
        }
        const spotifyArtist = await spotifyResponse.json();

        // Step 2: Fetch the artist's mbid (MusicBrainz ID) from Setlist.fm
        const setlistfmArtistResponse = await fetch(
            `${baseUrl}/api/setlist-fm/search-artists?${new URLSearchParams({
                artistName: spotifyArtist.name,
                page: "1"
            }).toString()}`
        );
        if (!setlistfmArtistResponse.ok) {
            const errorResponse = await setlistfmArtistResponse.json();
            return res.status(setlistfmArtistResponse.status).json({ error: errorResponse.error });
        }
        const setlistfmArtist = await setlistfmArtistResponse.json();

        // Step 3: Fetch setlists by the artist's mbid from Setlist.fm
        const setlistsResponse = await fetch(
            `${baseUrl}/api/setlist-fm/search-setlists?${new URLSearchParams({
                artistMbid: setlistfmArtist.mbid,
                country: country as string
            }).toString()}`
        );
        if (!setlistsResponse.ok) {
            const errorResponse = await setlistsResponse.json();
            return res.status(setlistsResponse.status).json({ error: errorResponse.error });
        }

        // Return a combined response containing full artist details and their setlists
        res.status(200).json({
            setlistfmArtist,
            setlists: await setlistsResponse.json(),
            spotifyArtist
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
