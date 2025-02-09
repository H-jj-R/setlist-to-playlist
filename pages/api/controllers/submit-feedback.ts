/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import SupportEmailTemplate from "@components/EmailTemplates/SupportEmailTemplate";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * API handler to allow people to submit feedback or ask for support about the site.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { email, message } = req.body;

        const { error } = await resend.emails.send({
            from: "Support <support@setlist-to-playlist.com>",
            headers: {
                "X-Entity-Ref-ID": `${Date.now()}`
            },
            react: SupportEmailTemplate({ email, message }),
            subject: "Support/Feedback",
            to: ["support@setlist-to-playlist.com"]
        });

        if (error) {
            res.status(400).json(error);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "common:internalServerError"
        });
    }
}
