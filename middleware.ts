import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import CryptoJS from "crypto-js";

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    if (pathname === "/setlist-search") {
        //! Implement once playlist authorisation needed
        // // Check for the Spotify access token in cookies
        // const refreshToken = request.cookies.get("spotify_user_refresh_token");

        // if (!refreshToken) {
        //     // Redirect to the Spotify authorisation page if token is missing
        //     const redirectUrl = new URL("/spotify-authorise", request.url);
        //     redirectUrl.searchParams.set("redirect", pathname);
        //     return NextResponse.redirect(redirectUrl);
        // }
    } else if (pathname.startsWith("/api/controllers/get-setlists")) {
        const accessToken = request.cookies.get("spotify_access_token");

        if (!accessToken) {
            // Redirect to generate-access-token route with the original path as a query parameter
            const redirectUrl = new URL("/api/spotify/generate-access-token", request.url);
            redirectUrl.searchParams.set("redirect", pathname); // Original route to redirect back to
            redirectUrl.searchParams.set("query", searchParams.get("query"));
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

// Specifies which paths the middleware should run on
export const config = {
    matcher: ["/setlist-search", "/api/:path*"]
};
