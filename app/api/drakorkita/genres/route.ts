import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeGenres } from "@/src/lib/scrapers/drakorkita";

/* ===============================
   GET ALL GENRES
   Example:
   /api/drakorkita/genres
================================ */

export const runtime = "nodejs";

export const GET = withAuth(async () => {
    try {
        // ===============================
        // Target URL Drakorkita
        // ===============================
        const url = `${process.env.DRAKORKITA_URL}/all`;

        // ===============================
        // Fetch HTML via Proxy Fallback
        // ===============================
        const html = await proxyFetchHTML(url);

        // ===============================
        // Scrape Genre List
        // ===============================
        const datas = await scrapeGenres({ data: html } as any);

        return NextResponse.json({
            message: "success",
            total: datas.length,
            datas,
        },
            {
                headers: {
                    "Cache-Control": "s-maxage=600, stale-while-revalidate=120",
                },
            }
        );
    } catch (err: unknown) {
        return NextResponse.json(
            {
                message: "error",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    }
});