import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next();
    return response;
}

export const config = {};
