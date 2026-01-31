import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { redis } from "@/src/lib/redisCache";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { scrapeAnimeSearch } from "@/src/lib/scrapers/anime";

export const runtime = "nodejs";

export const GET = withAuth(async (req) => {
    try {
        /* ===============================
           Query Param (?q=tes)
        =============================== */
        const { searchParams } = new URL(req.url);

        const q = searchParams.get("q");

        if (!q) {
            return NextResponse.json(
                {
                    message: "error",
                    error: "Query parameter 'q' is required",
                },
                { status: 400 }
            );
        }

        /* ===============================
           Cache Key
        =============================== */
        const cacheKey = `anime:search:${q}`;

        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("⚡ SEARCH CACHE HIT");

            return NextResponse.json({
                message: "success (cache)",
                data: cached,
            });
        }

        console.log("🔥 SEARCH CACHE MISS → SCRAPING");

        /* ===============================
           Target URL
        =============================== */
        const targetUrl = `${process.env.OTAKUDESU_URL}/?s=${encodeURIComponent(
            q
        )}&post_type=anime`;

        /* ===============================
           Fetch HTML via Proxy
        =============================== */
        const html = await proxyFetchHTML(targetUrl);

        /* ===============================
           Scrape Result
        =============================== */
        const result = scrapeAnimeSearch(html, q);

        /* ===============================
           Save Cache (6 jam)
        =============================== */
        await redis.set(cacheKey, result, {
            ex: 21600,
        });

        return NextResponse.json({
            message: "success",
            data: result,
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