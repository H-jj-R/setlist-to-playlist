import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import ForgotPasswordEmailTemplate from "@components/EmailTemplates/ForgotPasswordEmailTemplate";
import db from "@constants/db";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * API handler to send email to a user who has forgotten their password.
 */
export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "errors:methodNotAllowed" });
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
        
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // TODO: Put code into database for 10 minutes.

        // Send Email
        const { error } = await resend.emails.send({
            headers: {
                "X-Entity-Ref-ID": `ref-${Date.now()}`
            },
            from: "Setlist to Playlist <account.management@setlist-to-playlist.com>",
            to: [email],
            subject: "Forgot Password - Setlist to Playlist",
            react: ForgotPasswordEmailTemplate({ code })
        });

        if (error) {
            res.status(400).json(error);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "errors:internalServerError" });
    }
}
