/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to reset a user's password.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "common:methodNotAllowed" });
    }

    const { email, otp, newPassword } = req.body;

    // Validate input fields
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: "account:allFieldsRequired" });
    }

    try {
        // Check if OTP exists and is still valid (not expired)
        const [otpRecord] = await db.execute(
            "SELECT * FROM PasswordResetTokens WHERE email = ? AND otp = ? AND created_at >= NOW() - INTERVAL 10 MINUTE",
            [email, otp]
        );

        if ((otpRecord as any[]).length === 0) {
            return res.status(400).json({ error: "account:invalidCode" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));

        // Update the user's password
        await db.execute("UPDATE Users SET password_hash = ? WHERE email = ?", [hashedPassword, email]);

        // Delete used OTP
        await db.execute("DELETE FROM PasswordResetTokens WHERE email = ?", [email]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
