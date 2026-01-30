import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeCompletedSeries } from "@/src/lib/scrapers/drakorkita";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { redis } from "@/src/lib/redisCache";

export const runtime = "nodejs";

/* ===============================
   GET COMPLETED SERIES
   Example:
   /api/drakorkita/series/completed?page=1
================================ */

export const GET = withAuth(async (req: NextRequest) => {
    try {
        const page = req.nextUrl.searchParams.get("page") ?? "1";
        const currentPage = Number(page);

        // ✅ Cache key per page
        const cacheKey = `drakorkita:completed:page:${page}`;

        // ===============================
        // ✅ Redis Cache Check
        // ===============================
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("⚡ COMPLETED CACHE HIT:", cacheKey);

            return NextResponse.json({
                message: "success (cache)",
                ...(cached as any),
            });
        }

        console.log("🔥 COMPLETED CACHE MISS → SCRAPING");

        // ===============================
        // Target URL Completed
        // ===============================
        const url = `${process.env.DRAKORKITA_URL}/all?page=${page}&status=ended`;

        // ===============================
        // Fetch HTML via Proxy
        // ===============================
        const html = await proxyFetchHTML(url);

        // ===============================
        // Scrape Result
        // ===============================
        const result = scrapeCompletedSeries(html);

        // ===============================
        // Payload
        // ===============================
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
        // ✅ Save Cache (1 Hari)
        // ===============================
        await redis.set(cacheKey, payload, {
            ex: 86400, // ✅ 1x sehari
        });

        console.log("✅ COMPLETED SAVED:", cacheKey);

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