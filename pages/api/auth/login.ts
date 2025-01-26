import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import db from "../../../lib/constants/db";
import jwt from "jsonwebtoken";

/**
 * API handler to log in a user.
 */
export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "errors:methodNotAllowed" });
    }

    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ error: "account:emailPasswordRequired" });
    }

    try {
        // Check if the user exists
        const [rows] = await db.execute("SELECT * FROM Users WHERE email = ?", [email]);

        const users = rows as any[];
        if (users.length === 0) {
            return res.status(401).json({ error: "account:invalidEmailPassword" });
        }

        const user = users[0];

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "account:invalidEmailPassword" });
        }

        // Generate a JWT (JSON Web Token)
        const token = jwt.sign(
            { userId: user.user_id, username: user.username, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "12h" } // Token expires in 12 hours
        );

        res.status(200).json({ message: "account:loginSuccess", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "errors:internalServerError" });
    }
}
