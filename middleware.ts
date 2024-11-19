import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/setlist-search") {
        // Check for the Spotify access token in cookies
        const refreshToken = request.cookies.get("spotify_user_refresh_token");

        if (!refreshToken) {
            // Redirect to the Spotify authorisation page if token is missing
            const redirectUrl = new URL("/spotify-authorise", request.url);
            redirectUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

// Specifies which paths the middleware should run on
export const config = {
    matcher: ["/setlist-search"]
};
