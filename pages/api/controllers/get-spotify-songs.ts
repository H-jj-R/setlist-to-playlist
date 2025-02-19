/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import getBaseUrl from "@utils/getBaseUrl";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to get a set of songs from Spotify.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { artist, isPredicted } = req.query;
    const { setlist } = req.body;
    const baseUrl = getBaseUrl(req); // Get base URL for API requests

    // Ensure setlist has been provided
    if (!setlist) return res.status(400).json({ error: "exportSetlist:noSetlistProvided" });

    /**
     * Fetch Spotify details for a song.
     * @param {Record<string, any>} song - The song to fetch details for.
     * @returns {Promise<null | Record<string, any>>} The Spotify details for the song.
     */
    const fetchSongDetails = async (song: Record<string, any>): Promise<null | Record<string, any>> => {
        // Construct main artist search URL
        const mainArtistSearchUrl = `${baseUrl}/api/spotify/search-track?${new URLSearchParams({
            artist: artist as string,
            track: song.name
        }).toString()}`;

        // Construct cover artist search URL if a cover artist exists
        const coverArtist =
            isPredicted === "true"
                ? song.artist.toLowerCase() !== (artist as string).toLowerCase()
                    ? song.artist
                    : null
                : song.cover?.name || null;
        const coverArtistSearchUrl = coverArtist
            ? `${baseUrl}/api/spotify/search-track?${new URLSearchParams({
                  artist: coverArtist,
                  track: song.name
              }).toString()}`
            : null;

        /**
         * Fetch a track from the Spotify API.
         * @param {string} url - The URL to fetch the track from.
         * @returns {Promise<null | Record<string, any>>} The fetched track.
         */
        const fetchTrack = async (url: string): Promise<null | Record<string, any>> => {
            try {
                const response = await fetch(url, {
                    headers: { cookie: req.headers.cookie || "" } // Forward client cookies for access token
                });
                if (!response.ok) {
                    console.error(`${response.status} - ${url}`);
                    return null;
                }
                return await response.json();
            } catch (error) {
                console.error(error);
                return null;
            }
        };

        // Attempt to fetch details for the main artist first
        let trackDetails = await fetchTrack(mainArtistSearchUrl);

        // If no match for the main artist, try the cover artist
        if (!trackDetails?.name && coverArtistSearchUrl) trackDetails = await fetchTrack(coverArtistSearchUrl);

        return trackDetails || null;
    };

    try {
        // Asynchronously fetch Spotify details for each song in the setlist
        const spotifyDetails = await Promise.all(
            (isPredicted === "true"
                ? setlist.predictedSongs
                : setlist.sets.set.flatMap((set: any) =>
                      set.song.filter((song: any) => !["", "interlude", "intro"].includes(song.name.toLowerCase()))
                  )
            ).map(fetchSongDetails)
        );

        res.status(200).json(spotifyDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "common:loadSongsFailed" });
    }
}
