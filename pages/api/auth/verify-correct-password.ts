/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to verify a user's password is correct.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure the request method is POST
    if (req.method !== "POST") return res.status(405).json({ error: "common:methodNotAllowed" });

    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) return res.status(400).json({ error: "account:emailPasswordRequired" });

    try {
        // Connect to database through pool
        const dbConn = await db.getConnection();

        // Get the user with corresponding email
        const [rows] = await dbConn.execute("SELECT * FROM Users WHERE email = ?", [email]);
        const users = rows as any[];

        // Ensure the user exists
        if (users.length === 0) return res.status(401).json({ error: "account:invalidEmailPassword" });
        const user = users[0];

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) return res.status(401).json({ error: "account:invalidPassword" });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
