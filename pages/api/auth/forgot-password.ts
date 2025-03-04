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
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure the request method is POST
    if (req.method !== "POST") return res.status(405).json({ error: "common:methodNotAllowed" });

    const { email } = req.body;

    // Validate that email exists in the request body
    if (!email) return res.status(400).json({ error: "account:allFieldsRequired" });

    try {
        // Check if an account with the given email exists
        const [existingUser] = await db.execute("SELECT * FROM Users WHERE email = ?", [email]);
        if ((existingUser as any[]).length === 0) {
            return res.status(400).json({ error: "account:noAccountLinkedToEmail" });
        }

        // Generate a random 6-digit OTP for password reset
        const otp: string = Math.floor(100000 + Math.random() * 900000).toString();

        // Remove any existing OTPs associated with this email
        await db.execute("DELETE FROM PasswordResetTokens WHERE email = ?", [email]);

        // Store the new OTP in the database
        await db.execute("INSERT INTO PasswordResetTokens (email, otp) VALUES (?, ?)", [email, otp]);

        // Send the password reset email using Resend API
        const resend = new Resend(process.env.RESEND_API_KEY!);
        const { error } = await resend.emails.send({
            from: "Setlist to Playlist <account.management@setlist-to-playlist.com>",
            headers: { "X-Entity-Ref-ID": `ref-${Date.now()}` }, // Unique identifier for the email request
            react: await ForgotPasswordEmailTemplate({ otp }),
            subject: "Forgot Password - Setlist to Playlist",
            to: [email]
        });

        // Handle any email sending errors
        if (error) return res.status(400).json({ error });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
