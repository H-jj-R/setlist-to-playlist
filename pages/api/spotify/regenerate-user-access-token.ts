/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import CryptoJS from "crypto-js";
import decryptToken from "@utils/decryptToken";

/**
 * Refreshes the Spotify access token using the provided refresh token.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const cookies = cookie.parse(req.headers.cookie || "");
        const encryptedRefreshToken = cookies.spotify_user_refresh_token;

        // If no refresh token is found in the cookies, respond with an error
        if (!encryptedRefreshToken) {
            return res.status(401).json({
                error: "common:spotifyAccessTokenError"
            });
        }

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.SPOTIFY_API_C_ID!,
                client_secret: process.env.SPOTIFY_API_C_SECRET!,
                grant_type: "refresh_token",
                refresh_token: decryptToken(encryptedRefreshToken)
            })
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: "common:spotifyGenerateAccessTokenError"
            });
        }

        const data = await response.json();

        // Set the new access token cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize(
                "spotify_user_access_token",
                CryptoJS.AES.encrypt(data.access_token, process.env.ENCRYPTION_KEY!).toString(),
                {
                    httpOnly: true,
                    secure: true,
                    maxAge: data.expires_in,
                    path: "/"
                }
            )
        );

        // Extract the original redirect path and optional query parameter from the request

        if (req.query.redirect) {
            // If a redirect path is provided, redirect back to that path with the query parameter
            res.redirect(307, req.query.redirect as string);
        } else {
            // If no redirect path is provided, respond with a success message
            res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "common:internalServerError"
        });
    }
}
