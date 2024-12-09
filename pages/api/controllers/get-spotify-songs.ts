import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { artist } = req.query;
    const { setlist } = req.body;
    const baseUrl = getBaseUrl(req);

    if (!setlist) {
        return res.status(400).json({ error: "Setlist data is required" });
    }

    const fetchSongDetails = async (song: any) => {
        // TODO: Handle cover songs (different artist)
        // const songArtist = song.cover ? song.cover.artist : artist;

        try {
            const response = await fetch(`${baseUrl}/api/spotify/search-track?artist=${artist}&track=${song.name}`, {
                headers: {
                    cookie: req.headers.cookie || "" // Forward client cookies for access token
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch track: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching song details for ${song.name} by ${artist}:`, error);
            return null;
        }
    };

    const spotifyDetails = await Promise.all(
        setlist.sets.set.flatMap((set: any) => set.song.map((song: any) => fetchSongDetails(song)))
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
