import { NextApiRequest, NextApiResponse } from "next";

/**
 * API route to initiate the Spotify OAuth flow.
 * Redirects the user to Spotify's authorisation page.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { redirect } = req.query;

    const params = new URLSearchParams({
        client_id: process.env.SPOTIFY_API_C_ID!,
        response_type: "code",
        redirect_uri: process.env.SPOTIFY_API_REDIRECT_URI!,
        state: redirect.toString(), // Pass the redirect state to identify where to redirect after authoriation
        scope: "user-read-private ugc-image-upload playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public" // Permissions requested from the user
    });

    // Construct the full Spotify authorization URL
    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

    // Redirect the user to the Spotify authorization page
    res.redirect(authUrl);
}
