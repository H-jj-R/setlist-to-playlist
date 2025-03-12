/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to increase a user's query limit by 1.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure the request method is POST
    if (req.method !== "POST") return res.status(405).json({ error: "common:methodNotAllowed" });

    // Extract the token from the Authorization header and verify it exists
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "common:authorisationError" });

    try {
        // Verify and decode the JWT token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        // Connect to database through pool
        const dbConn = await db.getConnection();

        // Increment the query count for the user
        await dbConn.execute("UPDATE UserQueryLimits SET queries_today = queries_today + 1 WHERE user_id = ?", [userId]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
