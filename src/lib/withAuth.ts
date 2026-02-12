import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = new Set([
  "http://localhost:3001",
  "https://tamanto.web.id",
]);

function applyCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin");

  if (origin && allowedOrigins.has(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, x-api-key");
    res.headers.set("Vary", "Origin");
  }

  return res;
}

export function withAuth(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const pathname = req.nextUrl.pathname;

    // ✅ BYPASS AUTH UNTUK CRON
    if (pathname.startsWith("/api/cron")) {
      const response = await handler(req, context);
      return applyCors(req, response);
    }

    const apiKey = req.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.API_KEY) {
      return applyCors(
        req,
        NextResponse.json(
          {
            message: "Unauthorized",
            error:
              "Endpoint ini membutuhkan API Key. Jika belum punya, silakan hubungi admin 😄",
          },
          { status: 401 }
        )
      );
    }

    const response = await handler(req, context);
    return applyCors(req, response);
  };
}