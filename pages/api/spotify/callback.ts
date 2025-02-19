/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import getBaseUrl from "@utils/getBaseUrl";
import cookie from "cookie";
import CryptoJS from "crypto-js";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API route to handle Spotify OAuth callback.
 *
 * Exchanges an authorisation code for an access token and refresh token, encrypts them,
 * and stores them in secure cookies, then redirects the user to a specified URL.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code || null;
    const state = req.query.state || null;

    // If no authorisation code is provided, return a 400 error
    if (!code) return res.status(400).json({ error: "exportSetlist:spotifyCallbackError" });

    try {
        const baseUrl = getBaseUrl(req); // Get base URL for API requests

        // Make a POST request to Spotify's token endpoint to exchange the authorisation code for tokens
        const response = await fetch("https://accounts.spotify.com/api/token", {
            body: new URLSearchParams({
                client_id: process.env.SPOTIFY_API_C_ID!,
                client_secret: process.env.SPOTIFY_API_C_SECRET!,
                code: code as string,
                grant_type: "authorization_code",
                redirect_uri: process.env.SPOTIFY_API_REDIRECT_URI!
            }).toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST"
        });
        if (!response.ok) {
            return res.status(response.status).json({
                error: "exportSetlist:spotifyCallbackError"
            });
        }
        const data = await response.json();

        // Set the encrypted access token and refresh token as a secure cookies
        res.setHeader("Set-Cookie", [
            // Access token cookie
            cookie.serialize(
                "spotify_user_access_token",
                CryptoJS.AES.encrypt(data.access_token, process.env.ENCRYPTION_KEY!).toString(),
                {
                    httpOnly: true,
                    maxAge: data.expires_in,
                    path: "/",
                    secure: true
                }
            ),
            // Refresh token cookie
            cookie.serialize(
                "spotify_user_refresh_token",
                CryptoJS.AES.encrypt(data.refresh_token, process.env.ENCRYPTION_KEY!).toString(),
                {
                    httpOnly: true,
                    maxAge: 2147483646,
                    path: "/",
                    secure: true
                }
            )
        ]);

        // Redirect the user to the original state URL or the home page if none provided
        res.redirect(state ? `${baseUrl}${decodeURIComponent(state as string)}` : baseUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
