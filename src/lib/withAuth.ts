import { NextRequest, NextResponse } from "next/server";

/**
 * Wrapper untuk proteksi API menggunakan x-api-key
 * - Semua /api/cron/* DIIZINKAN tanpa auth
 * - Selain itu wajib x-api-key
 */
export function withAuth(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const pathname = req.nextUrl.pathname;

    // ✅ BYPASS AUTH UNTUK CRON
    if (pathname.startsWith("/api/cron")) {
      return handler(req, context);
    }

    const apiKey = req.headers.get("x-api-key");

    // ❌ Jika API Key tidak dikirim atau salah
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          error:
            "Endpoint ini membutuhkan API Key. Jika belum punya, silakan hubungi admin (atau traktir kopi dulu 😄).",
        },
        { status: 401 }
      );
    }

    // ✅ Jika valid → lanjut handler asli
    return handler(req, context);
  };
}