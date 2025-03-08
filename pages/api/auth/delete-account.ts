/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to delete a user account.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure the request method is DELETE
    if (req.method !== "DELETE") return res.status(405).json({ error: "common:methodNotAllowed" });

    // Extract the token from the Authorization header and verify it exists
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "common:authorisationError" });

    try {
        // Verify and decode the JWT token to extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        // Delete the user from the database
        await db.query("DELETE FROM Users WHERE user_id = ?", [userId]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
