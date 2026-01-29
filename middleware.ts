import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // ✅ Public routes (tidak butuh API Key)
    if (
        pathname.startsWith("/docs") ||
        pathname.startsWith("/api/swagger")
    ) {
        return NextResponse.next();
    }

    // ✅ Proteksi semua API scraping
    if (pathname.startsWith("/api")) {
        const apiKey = req.headers.get("x-api-key");

        if (!apiKey || apiKey !== process.env.API_KEY) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                    error:
                        "Endpoint ini membutuhkan API Key. Silakan sertakan header x-api-key yang valid.",
                },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};