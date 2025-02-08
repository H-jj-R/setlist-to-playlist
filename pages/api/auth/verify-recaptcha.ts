import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to verify a reCAPTCHA token.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check if the request method is POST
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "common:methodNotAllowed" });
    }

    const { token } = req.body;

    // Check if the reCAPTCHA token is provided in the request body
    if (!token) {
        return res.status(400).json({ success: false, error: "account:missingRecaptchaToken" });
    }

    try {
        // Send a request to Google's reCAPTCHA verification endpoint
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY!,
                response: token
            }).toString()
        });

        const data = await response.json();

        // Check if the reCAPTCHA verification was successful
        if (data.success) {
            return res.status(200).json({ success: true });
        } else {
            // If verification failed, return the error codes from Google's response
            return res.status(400).json({
                success: false,
                error: data["error-codes"]?.join(", ") || "account:recaptchaNotVerified"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "common:internalServerError" });
    }
}
