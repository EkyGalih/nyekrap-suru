import { NextRequest, NextResponse } from "next/server";

import { scrapeOngoingSeries } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";

import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { redis } from "@/src/lib/redisCache";

export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest) => {
    try {
        const page = req.nextUrl.searchParams.get("page") ?? "1";
        const currentPage = Number(page);

        // ✅ Cache key per page
        const cacheKey = `drakorkita:ongoing:page:${page}`;

        // ===============================
        // ✅ Redis Cache Check
        // ===============================
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("⚡ ONGOING CACHE HIT:", cacheKey);

            return NextResponse.json({
                message: "success (cache)",
                ...(cached as any),
            });
        }

        console.log("🔥 ONGOING CACHE MISS → SCRAPING");

        // ===============================
        // Fetch HTML via ScraperAPI Proxy
        // ===============================
        const url = `${process.env.DRAKORKITA_URL}/all?status=returning%20series&page=${page}`;
        const html = await proxyFetchHTML(url);

        // ===============================
        // Scrape Result
        // ===============================
        const result = scrapeOngoingSeries(html);

        const totalPage = result.pagination;

        // ===============================
        // Payload
        // ===============================
        const payload = {
            page: currentPage,
            pagination: totalPage,
            datas: result.datas,

            filters: result.filters,
            sidebar: result.sidebar,

            pagination_info: {
                current_page: currentPage,
                total_page: totalPage,
                has_next: currentPage < totalPage,
                has_prev: currentPage > 1,
                next_page: currentPage < totalPage ? currentPage + 1 : null,
                prev_page: currentPage > 1 ? currentPage - 1 : null,
            },
        };

        // ===============================
        // ✅ Save Redis Cache (1 Hari)
        // ===============================
        await redis.set(cacheKey, payload, {
            ex: 86400, // ✅ 1x sehari
        });

        console.log("✅ ONGOING SAVED:", cacheKey);

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