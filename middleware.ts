import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    if (pathname.startsWith("/api/controllers/get-setlists")) {
        if (!request.cookies.get("spotify_access_token")) {
            const redirectUrl = new URL("/api/spotify/generate-access-token", request.url);
            redirectUrl.searchParams.set("redirect", pathname); // Original route to redirect back to
            redirectUrl.searchParams.set("query", searchParams.get("query"));
            return NextResponse.redirect(redirectUrl);
        }
    } else if (pathname.startsWith("/api/controllers/check-for-user-token")) {
        if (request.cookies.get("spotify_user_refresh_token") && !request.cookies.get("spotify_user_access_token")) {
            const redirectUrl = new URL("/api/spotify/regenerate-user-access-token", request.url);
            redirectUrl.searchParams.set("redirect", pathname); // Original route to redirect back to
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

// Specifies which paths the middleware should run on
export const config = {
    matcher: ["/api/:path*"]
};
