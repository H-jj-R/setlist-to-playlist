import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import db from "@constants/db";

/**
 * API handler to sign up a new user.
 */
export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "errors:methodNotAllowed" });
    }

    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
        return res.status(400).json({ error: "account:allFieldsRequired" });
    }

    try {
        // Check if email already exists
        const [existingUser] = await db.execute("SELECT * FROM Users WHERE email = ?", [email]);

        if ((existingUser as any[]).length > 0) {
            return res.status(400).json({ error: "account:emailInUse" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

        // Insert user into the database
        await db.execute("INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)", [
            username,
            email,
            hashedPassword
        ]);

        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "errors:internalServerError" });
    }
}
