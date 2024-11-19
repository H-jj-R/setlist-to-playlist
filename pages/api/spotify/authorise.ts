import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @param req Request details and parameters
 * @param res Response object
 * @returns
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { redirect } = req.query;
    const params = new URLSearchParams({
        client_id: process.env.SPOTIFY_API_C_ID,
        response_type: "code",
        redirect_uri: process.env.SPOTIFY_API_REDIRECT_URI,
        state: redirect.toString(),
        scope: "user-read-private user-read-email ugc-image-upload playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public"
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

    res.redirect(authUrl);
}
