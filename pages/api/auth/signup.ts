import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import db from "../../../lib/constants/db";

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if email already exists
        const [existingUser] = await db.execute("SELECT * FROM Users WHERE email = ?", [email]);

        if ((existingUser as any[]).length > 0) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into the database
        const [result] = await db.execute("INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)", [
            username,
            email,
            hashedPassword
        ]);

        res.status(201).json({ message: "User created successfully", userId: (result as any).insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
