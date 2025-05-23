/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to verify a reCAPTCHA token.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure the request method is POST
    if (req.method !== "POST") return res.status(405).json({ error: "common:methodNotAllowed", success: false });

    const { token } = req.body;

    // Ensure the reCAPTCHA token is provided in the request body
    if (!token) return res.status(400).json({ error: "account:missingRecaptchaToken", success: false });

    try {
        // Send a request to Google's reCAPTCHA verification endpoint
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            body: new URLSearchParams({
                response: token,
                secret: process.env.RECAPTCHA_SECRET_KEY!
            }).toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST"
        });
        const data = await response.json();

        // Check if the reCAPTCHA verification was successful
        if (data.success) {
            return res.status(200).json({ success: true });
        } else {
            // If verification failed, return the error codes from Google's response
            return res.status(400).json({
                error: data["error-codes"]?.join(", ") || "account:recaptchaNotVerified",
                success: false
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "common:internalServerError", success: false });
    }
}
