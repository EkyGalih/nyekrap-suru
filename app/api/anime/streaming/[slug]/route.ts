import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { redis } from "@/src/lib/redisCache";
import { getErrorMessage } from "@/src/lib/getErrorMessage";

import { scrapeOtakudesuEpisode } from "@/src/lib/scrapers/anime";

export const runtime = "nodejs";

export const GET = withAuth(async (_req, context) => {
    try {
        /* ===============================
           ✅ FIX PARAMS PROMISE
        =============================== */
        const { slug } = await context.params;

        const cacheKey = `otakudesu:episode:${slug}`;

        /* ===============================
           ✅ Redis Cache Check
        =============================== */
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("⚡ OTAKUDESU EPISODE CACHE HIT");

            return NextResponse.json({
                message: "success (cache)",
                data: cached,
            });
        }

        console.log("🔥 OTAKUDESU EPISODE CACHE MISS → SCRAPING");

        /* ===============================
           ✅ Fetch HTML via Proxy
        =============================== */
        const targetUrl = `${process.env.OTAKUDESU_URL}/episode/${slug}/`;

        const html = await proxyFetchHTML(targetUrl);

        /* ===============================
           ✅ Scrape Result
        =============================== */
        const result = scrapeOtakudesuEpisode(html);

        /* ===============================
           ✅ Save Cache (6 jam)
        =============================== */
        await redis.set(cacheKey, result, {
            ex: 21600,
        });

        console.log("✅ OTAKUDESU EPISODE SAVED");

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