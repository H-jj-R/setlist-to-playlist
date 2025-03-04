/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import SupportEmailTemplate from "@components/EmailTemplates/SupportEmailTemplate";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

/**
 * API handler to allow people to submit feedback or ask for support about the site.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { email, message } = req.body;

        // Send the support/feedback email using Resend API
        const resend = new Resend(process.env.RESEND_API_KEY!);
        const { error } = await resend.emails.send({
            from: "Support <support@setlist-to-playlist.com>",
            headers: { "X-Entity-Ref-ID": `ref-${Date.now()}` }, // Unique identifier for the email request
            react: await SupportEmailTemplate({ email, message }),
            subject: "Support/Feedback",
            to: ["support@setlist-to-playlist.com"]
        });

        // Handle any email sending errors
        if (error) return res.status(400).json(error);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
