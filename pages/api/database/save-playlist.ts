import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/constants/db";
import jwt from "jsonwebtoken";

/**
 * API handler to save Spotify playlist details into the database.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorised" });
    }

    const { playlistDetails } = req.body;

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        // TODO: Save to database
        
        res.status(200).json({ message: "Playlist saved successfully" });
    } catch (error) {
        console.error("Error saving playlist to database:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
