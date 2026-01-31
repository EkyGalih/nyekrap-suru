import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { redis } from "@/src/lib/redisCache";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { scrapeAnimeGenres } from "@/src/lib/scrapers/anime";

export const runtime = "nodejs";

export const GET = withAuth(async () => {
    try {
        const cacheKey = "anime:genres";

        /* ===============================
           ✅ Redis Cache Check
        =============================== */
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("⚡ ANIME GENRES CACHE HIT");

            return NextResponse.json({
                message: "success (cache)",
                data: cached,
            });
        }

        console.log("🔥 ANIME GENRES CACHE MISS → SCRAPING");

        /* ===============================
           ✅ Fetch HTML via Proxy
        =============================== */
        const targetUrl = `${process.env.OTAKUDESU_URL}/genre-list/`;

        const html = await proxyFetchHTML(targetUrl);

        /* ===============================
           ✅ Scrape Result
        =============================== */
        const result = scrapeAnimeGenres(html);

        /* ===============================
           ✅ Save Cache (24 jam)
        =============================== */
        await redis.set(cacheKey, result, {
            ex: 86400,
        });

        console.log("✅ ANIME GENRES SAVED");

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