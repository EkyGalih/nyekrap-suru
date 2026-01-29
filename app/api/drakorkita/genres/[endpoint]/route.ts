import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeDetailGenres } from "@/src/lib/scrapers/drakorkita";
import { jsonCache } from "@/src/lib/jsonCache";
import { getErrorMessage } from "@/src/lib/getErrorMessage";

export const runtime = "nodejs";

/* ===============================
   GET DRAMA BY GENRE
   Example:
   /api/drakorkita/genres/history?page=1
================================ */

export const GET = withAuth(
    async (
        req: NextRequest,
        { params }: { params: Promise<{ endpoint: string }> }
    ) => {
        try {
            // ✅ unwrap params
            const { endpoint } = await params;

            // ✅ query page
            const page = req.nextUrl.searchParams.get("page") ?? "1";

            // ===============================
            // Genre Normalization
            // history → History
            // action-drama → Action Drama
            // ===============================
            const genre = endpoint
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

            // ===============================
            // Build Target URL
            // ===============================
            const url = `${process.env.DRAKORKITA_URL}/all?genre=${encodeURIComponent(
                genre
            )}&page=${page}`;

            // ===============================
            // Fetch HTML via Proxy
            // ===============================
            const html = await proxyFetchHTML(url);

            // ===============================
            // Scrape Result from HTML
            // ===============================
            const result = scrapeDetailGenres(html);

            // ===============================
            // Return Cached JSON (5 min)
            // ===============================
            return jsonCache(
                {
                    message: "success",
                    genre,
                    page: Number(page),
                    pagination: result.pagination,
                    total: result.datas.length,
                    datas: result.datas,
                },
                300
            );
        } catch (err: unknown) {
            return NextResponse.json(
                {
                    message: "error",
                    error: getErrorMessage(err),
                },
                { status: 500 }
            );
        }
    }
);