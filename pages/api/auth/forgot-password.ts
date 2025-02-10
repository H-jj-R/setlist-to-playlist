/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import ForgotPasswordEmailTemplate from "@components/EmailTemplates/ForgotPasswordEmailTemplate";
import db from "@constants/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

/**
 * API handler to send email to a user who has forgotten their password.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "common:methodNotAllowed" });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "account:allFieldsRequired" });
    }

    try {
        // Check if email exists
        const [existingUser] = await db.execute("SELECT * FROM Users WHERE email = ?", [email]);

        if ((existingUser as any[]).length === 0) {
            return res.status(400).json({ error: "account:noAccountLinkedToEmail" });
        }

        // Generate random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Remove any existing OTP for this email
        await db.execute("DELETE FROM PasswordResetTokens WHERE email = ?", [email]);

        // Insert new OTP into the database
        await db.execute("INSERT INTO PasswordResetTokens (email, otp) VALUES (?, ?)", [email, otp]);

        // Send Email
        const resend = new Resend(process.env.RESEND_API_KEY!);
        const { error } = await resend.emails.send({
            from: "Setlist to Playlist <account.management@setlist-to-playlist.com>",
            headers: {
                "X-Entity-Ref-ID": `ref-${Date.now()}`
            },
            react: ForgotPasswordEmailTemplate({ otp }),
            subject: "Forgot Password - Setlist to Playlist",
            to: [email]
        });

        if (error) {
            res.status(400).json(error);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
