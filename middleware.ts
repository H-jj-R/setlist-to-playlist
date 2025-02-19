/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware function to handle authentication and redirect logic for specific API routes.
 *
 * @param {NextRequest} req - The incoming API request object.
 * @returns The NextResponse object, either allowing the request to continue or redirecting.
 */
export async function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;

    /**
     * Helper function to create a redirect URL with query parameters preserved.
     *
     * @param {string} targetPath - The destination path for redirection.
     * @param {string} redirectPath - The original route to redirect back to.
     * @returns {URL} The constructed redirect URL.
     */
    const createRedirectUrl = (targetPath: string, redirectPath: string): URL => {
        const redirectUrl = new URL(targetPath, req.url);
        redirectUrl.searchParams.set("redirect", redirectPath); // Original route to redirect back to
        searchParams.forEach((value, key): void => {
            redirectUrl.searchParams.set(key, value);
        });
        return redirectUrl;
    };

    // Middleware logic for handling authentication-related API routes
    if (
        pathname.startsWith("/api/controllers/get-setlists") ||
        pathname.startsWith("/api/controllers/get-spotify-songs") ||
        pathname.startsWith("/api/spotify/search-artist") ||
        pathname.startsWith("/api/spotify/get-tracks")
    ) {
        // If no Spotify access token, redirect to the token generation endpoint
        if (!req.cookies.get("spotify_access_token")) {
            const redirectUrl = createRedirectUrl("/api/spotify/generate-access-token", pathname);
            return NextResponse.redirect(redirectUrl);
        }
    } else if (pathname.startsWith("/api/controllers/check-for-authentication")) {
        const hasRefreshToken = req.cookies.get("spotify_user_refresh_token");
        const hasAccessToken = req.cookies.get("spotify_user_access_token");

        // If a refresh token exists but an access token is missing, regenerate the access token
        if (hasRefreshToken && !hasAccessToken) {
            return NextResponse.redirect(createRedirectUrl("/api/spotify/regenerate-user-access-token", pathname));
        }
    }

    // Allow the request to proceed normally if no middleware conditions are met
    return NextResponse.next();
}

/**
 * Configuration for the middleware, specifying which API routes it should apply to.
 */
export const config = {
    matcher: [
        "/api/controllers/get-setlists/:path*",
        "/api/controllers/get-spotify-songs/:path*",
        "/api/spotify/search-artist/:path*",
        "/api/spotify/get-tracks/:path*",
        "/api/controllers/check-for-authentication/:path*"
    ]
};
