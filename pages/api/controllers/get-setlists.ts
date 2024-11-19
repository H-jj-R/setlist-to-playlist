import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query;

    try {
        const baseUrl = getBaseUrl(req);

        // Fetch Spotify artist details
        const spotifyResponse = await fetch(`${baseUrl}/api/spotify/search-artist?query=${query}`, {
            headers: {
                cookie: req.headers.cookie || ""
            }
        });

        if (!spotifyResponse.ok) {
            throw new Error("Failed to fetch Spotify artist");
        }

        const spotifyArtist = await spotifyResponse.json();

        // Fetch mbid of artist
        const setlistfmArtistResponse = await fetch(
            `${baseUrl}/api/setlist-fm/search-artists?artistName=${spotifyArtist.name}`
        );

        if (!setlistfmArtistResponse.ok) {
            throw new Error("Error finding artist!");
        }

        // Fetch setlists by artist mbid
        const setlistsResponse = await fetch(
            `${baseUrl}/api/setlist-fm/search-setlists?artistMbid=${(await setlistfmArtistResponse.json()).mbid}`
        );

        if (!setlistsResponse.ok) {
            throw new Error("No setlists found!");
        }

        const setlists = await setlistsResponse.json();

        res.status(200).json({
            spotifyArtist,
            setlists
        });
    } catch (error) {
        console.error("Error fetching setlists:", error);
        res.status(500).json({ error: error.message });
    }
}

const getBaseUrl = (req: NextApiRequest) => {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    return `${protocol}://${host}`;
};
