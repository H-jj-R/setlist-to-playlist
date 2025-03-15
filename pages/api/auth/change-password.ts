/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to change a user's password.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure the request method is POST
    if (req.method !== "POST") return res.status(405).json({ error: "common:methodNotAllowed" });

    const { email, newPassword } = req.body;

    // Validate input fields
    if (!email || !newPassword) return res.status(400).json({ error: "account:allFieldsRequired" });

    try {
        // Connect to database through pool
        const dbConn = await db.getConnection();

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));

        // Update the user's password
        await dbConn.execute("UPDATE Users SET password_hash = ? WHERE email = ?", [hashedPassword, email]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
