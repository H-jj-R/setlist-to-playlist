import { NextApiRequest, NextApiResponse } from "next";
import getBaseUrl from "@utils/getBaseUrl";

/**
 * API handler to get a set of songs from Spotify.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { artist, isPredicted } = req.query;
    const { setlist } = req.body;
    const baseUrl = getBaseUrl(req);

    if (!setlist) {
        return res.status(400).json({ error: "exportSetlist:noSetlistProvided" });
    }

    const fetchSongDetails = async (song: any) => {
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

        // Attempt to fetch details for the main artist first
        const fetchTrack = async (url: string) => {
            try {
                const response = await fetch(url, {
                    headers: {
                        cookie: req.headers.cookie || "" // Forward client cookies for access token
                    }
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
        let trackDetails = await fetchTrack(mainArtistSearchUrl);

        // If no match for the main artist, try the cover artist
        if (!trackDetails?.name && coverArtistSearchUrl) {
            trackDetails = await fetchTrack(coverArtistSearchUrl);
        }

        return trackDetails || { error: `No match found for ${song.name}` };
    };

    try {
        const spotifyDetails = await Promise.all(
            (isPredicted === "true"
                ? setlist.predictedSongs
                : setlist.sets.set.flatMap((set: any) =>
                      set.song.filter((song: any) => !["intro", "interlude", ""].includes(song.name.toLowerCase()))
                  )
            ).map(fetchSongDetails)
        );

        res.status(200).json(spotifyDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "common:loadSongsFailed" });
    }
}
