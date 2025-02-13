/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;

    // Helper function to build a redirect URL with optional query parameters
    const createRedirectUrl = (targetPath: string, redirectPath: string): URL => {
        const redirectUrl = new URL(targetPath, req.url);
        redirectUrl.searchParams.set("redirect", redirectPath); // Original route to redirect back to
        searchParams.forEach((value, key) => {
            redirectUrl.searchParams.set(key, value);
        });
        return redirectUrl;
    };

    // Route-specific middleware logic
    if (
        pathname.startsWith("/api/controllers/get-setlists") ||
        pathname.startsWith("/api/controllers/get-spotify-songs") ||
        pathname.startsWith("/api/spotify/search-artist") ||
        pathname.startsWith("/api/spotify/get-tracks")
    ) {
        if (!req.cookies.get("spotify_access_token")) {
            const redirectUrl = createRedirectUrl("/api/spotify/generate-access-token", pathname);
            return NextResponse.redirect(redirectUrl);
        }
    } else if (pathname.startsWith("/api/controllers/check-for-authentication")) {
        const hasRefreshToken = req.cookies.get("spotify_user_refresh_token");
        const hasAccessToken = req.cookies.get("spotify_user_access_token");
        if (hasRefreshToken && !hasAccessToken) {
            return NextResponse.redirect(createRedirectUrl("/api/spotify/regenerate-user-access-token", pathname));
        }
    }

    // Allow the request to proceed if no middleware conditions are met
    return NextResponse.next();
}

// Specifies which paths the middleware should run on
export const config = {
    matcher: [
        "/api/controllers/get-setlists/:path*",
        "/api/controllers/get-spotify-songs/:path*",
        "/api/spotify/search-artist/:path*",
        "/api/spotify/get-tracks/:path*",
        "/api/controllers/check-for-authentication/:path*"
    ]
};
