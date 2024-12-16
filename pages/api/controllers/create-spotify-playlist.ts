import { NextApiRequest, NextApiResponse } from "next";
import getBaseUrl from "../../../lib/utils/getBaseUrl";

/**
 * API handler to export a chosen setlist to a Spotify playlist, with customisation.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const baseUrl = getBaseUrl(req);
        // TODO
        // 1. Get user data
        

        // 2. Create playlist


        // 3. Add songs to playlist


        // 4. Add cover image (if provided)
        
        
    } catch (error) {
        console.error("Error creating playlist: ", error);
        res.status(500).json({ error: error.message });
    }
}
