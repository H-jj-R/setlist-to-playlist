import { set } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { artist } = req.query;
    const { setlist } = req.body;
    const baseUrl = getBaseUrl(req);

    if (!setlist) {
        return res.status(400).json({ error: "Setlist data is required" });
    }

    const fetchSongDetails = async (song: any) => {
        const mainArtistSearchUrl = `${baseUrl}/api/spotify/search-track?artist=${artist}&track=${encodeURIComponent(
            song.name
        )}`;
        const coverArtist = song.cover?.name || null; // Check if there's a cover artist
        const coverArtistSearchUrl = coverArtist
            ? `${baseUrl}/api/spotify/search-track?artist=${encodeURIComponent(coverArtist)}&track=${encodeURIComponent(
                  song.name
              )}`
            : null;

        // Attempt to fetch details for the main artist first
        const fetchTrack = async (url: string) => {
            try {
                const response = await fetch(url, {
                    headers: {
                        cookie: req.headers.cookie || "" // Forward client cookies for access token
                    }
                });
                if (response.ok) {
                    return await response.json();
                } else {
                    console.error(`Failed to fetch track from URL: ${url}`);
                    return null;
                }
            } catch (error) {
                console.error(`Error fetching track:`, error);
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

    console.log(JSON.stringify(setlist));
    const spotifyDetails = await Promise.all(
        setlist.sets.set.flatMap((set: any) =>
            set.song
                .filter((song: any) => song.name.toLowerCase() !== "intro" && song.name.toLowerCase() !== "interlude")
                .map((song: any) => fetchSongDetails(song))
        )
    );

    res.status(200).json(spotifyDetails);
}

/**
 * Utility function to construct the base URL of the server.
 *
 * @param {NextApiRequest} req - The API request object.
 * @returns {string} - The base URL string.
 */
function getBaseUrl(req: NextApiRequest): string {
    const protocol = req.headers["x-forwarded-proto"] || "http"; // Determine the protocol (HTTP or HTTPS)
    const host = req.headers.host!; // Get the host from headers
    return `${protocol}://${host}`; // Construct and return the base URL
}
