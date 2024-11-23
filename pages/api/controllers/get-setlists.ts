import { NextApiRequest, NextApiResponse } from "next";

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
        const spotifyResponse = await fetch(`${baseUrl}/api/spotify/search-artist?query=${query}`, {
            headers: {
                cookie: req.headers.cookie || "" // Forward client cookies for access token
            }
        });

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!spotifyResponse.ok) {
            // Get the error details from the response
            const errorResponse = await spotifyResponse.json();
            const errorMessage = errorResponse.error?.message || "Unknown error";
            throw new Error(`${spotifyResponse.status}: Failed to fetch Spotify artist - Error: ${errorMessage}`);
        }

        const spotifyArtist = await spotifyResponse.json();

        // Step 2: Fetch the artist's mbid (MusicBrainz ID) from Setlist.fm
        const setlistfmArtistResponse = await fetch(
            `${baseUrl}/api/setlist-fm/search-artists?artistName=${spotifyArtist.name}&page=1`
        );

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!setlistfmArtistResponse.ok) {
            // Get the error details from the response
            const errorResponse = await setlistfmArtistResponse.json();
            const errorMessage = errorResponse.error?.message || "Unknown error";
            throw new Error(
                `${setlistfmArtistResponse.status}: Failed to fetch setlist.fm artist - Error: ${errorMessage}`
            );
        }

        const { mbid } = await setlistfmArtistResponse.json();

        // Step 3: Fetch setlists by the artist's mbid from Setlist.fm
        const setlistsResponse = await fetch(`${baseUrl}/api/setlist-fm/search-setlists?artistMbid=${mbid}`);

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!setlistsResponse.ok) {
            // Get the error details from the response
            const errorResponse = await setlistsResponse.json();
            const errorMessage = errorResponse.error?.message || "Unknown error";
            throw new Error(`${setlistsResponse.status}: Failed to fetch setlists - Error: ${errorMessage}`);
        }

        // Return a combined response containing Spotify artist details and their setlists
        res.status(200).json({
            spotifyArtist,
            setlists: await setlistsResponse.json()
        });
    } catch (error) {
        console.error("Error fetching setlists: ", error);
        res.status(500).json({ error: error.message });
    }
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
