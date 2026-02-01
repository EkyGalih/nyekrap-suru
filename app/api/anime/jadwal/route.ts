import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { redis } from "@/src/lib/redisCache";

import { scrapeAnimeSchedule } from "@/src/lib/scrapers/anime";

export const runtime = "nodejs";

/* ===============================
   ✅ GET Jadwal Rilis Anime
=============================== */
export const GET = withAuth(async () => {
    try {
        const cacheKey = "anime:schedule";

        /* ===============================
           ✅ Redis Cache Check
        =============================== */
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("⚡ SCHEDULE CACHE HIT");

            return NextResponse.json({
                message: "success (cache)",
                data: cached,
            });
        }

        console.log("🔥 CACHE MISS → SCRAPING SCHEDULE");

        /* ===============================
           ✅ Fetch HTML via Proxy
        =============================== */
        const targetUrl = `${process.env.OTAKUDESU_URL}/jadwal-rilis/`;

        const html = await proxyFetchHTML(targetUrl);

        /* ===============================
           ✅ Scrape Result
        =============================== */
        const result = scrapeAnimeSchedule(html);

        /* ===============================
           ✅ Save Cache (12 jam)
        =============================== */
        await redis.set(cacheKey, result, {
            ex: 43200,
        });

        console.log("✅ SCHEDULE SAVED");

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