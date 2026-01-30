import { NextRequest, NextResponse } from "next/server";

import { scrapeMovie } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { redis } from "@/src/lib/redisCache";

export const runtime = "nodejs";

/* ===============================
   GET ALL MOVIES
   Example:
   /api/drakorkita/movie?page=1
================================ */

export const GET = withAuth(async (req: NextRequest) => {
    try {
        const page = req.nextUrl.searchParams.get("page") ?? "1";
        const currentPage = Number(page);

        // ===============================
        // ✅ Cache Key per Page
        // ===============================
        const cacheKey = `drakorkita:movie:page:${page}`;

        // ===============================
        // ✅ Redis Cache Check
        // ===============================
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("⚡ SEARCH CACHE HIT:", cacheKey);

            return NextResponse.json({
                message: "success (cache)",
                ...(typeof cached === "string" ? JSON.parse(cached) : cached),
            });
        }

        console.log("🔥 MOVIE CACHE MISS → SCRAPING:", cacheKey);

        // ===============================
        // Target URL
        // ===============================
        const url = `${process.env.DRAKORKITA_URL}/all?media_type=movie&page=${page}`;

        // ===============================
        // Fetch HTML via Proxy
        // ===============================
        const html = await proxyFetchHTML(url);

        // ===============================
        // Scrape Result
        // ===============================
        const result = scrapeMovie(html);

        const payload = {
            page: currentPage,
            pagination: result.pagination,
            total: result.datas.length,
            datas: result.datas,

            pagination_info: {
                current_page: currentPage,
                total_page: result.pagination,
                has_next: currentPage < result.pagination,
                has_prev: currentPage > 1,
                next_page: currentPage < result.pagination ? currentPage + 1 : null,
                prev_page: currentPage > 1 ? currentPage - 1 : null,
            },
        };

        // ===============================
        // ✅ Save Cache (6 Jam)
        // ===============================
        await redis.set(cacheKey, JSON.stringify(payload), {
            ex: 600,
        });

        console.log("✅ MOVIE SAVED:", cacheKey);

        return NextResponse.json({
            message: "success",
            ...payload,
        });
    } catch (err: unknown) {
        return NextResponse.json(
            {
                message: "error",
                error: getErrorMessage(err),
            },
            { status: 500 }
        );
    }
});