/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to sign up a new user.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure the request method is POST
    if (req.method !== "POST") return res.status(405).json({ error: "common:methodNotAllowed" });

    const { email, password, username } = req.body;

    // Validate input fields
    if (!username || !email || !password) return res.status(400).json({ error: "account:allFieldsRequired" });

    try {
        // Check if email already exists in the database
        const [existingUser] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
        if ((existingUser as any[]).length > 0) return res.status(400).json({ error: "account:emailInUse" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

        // Insert user into the database
        await db.query("INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)", [
            username,
            email,
            hashedPassword
        ]);

        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
