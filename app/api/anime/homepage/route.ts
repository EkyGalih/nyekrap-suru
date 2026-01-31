import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { redis } from "@/src/lib/redisCache";
import { scrapeOtakudesuHome } from "@/src/lib/scrapers/anime";


export const runtime = "nodejs";

export const GET = withAuth(async () => {
    try {
        const cacheKey = "otakudesu:homepage";

        /* ===============================
           ✅ Redis Cache Check
        =============================== */
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("⚡ OTAKUDESU CACHE HIT");

            return NextResponse.json({
                message: "success (cache)",
                data: cached,
            });
        }

        console.log("🔥 OTAKUDESU CACHE MISS → SCRAPING");

        /* ===============================
           ✅ Fetch HTML via Proxy
        =============================== */
        const targetUrl = `${process.env.OTAKUDESU_URL}`;
        const html = await proxyFetchHTML(targetUrl);

        /* ===============================
           ✅ Scrape Result
        =============================== */
        const result = scrapeOtakudesuHome(html);

        /* ===============================
           ✅ Save Cache (6 jam)
        =============================== */
        await redis.set(cacheKey, result, {
            ex: 21600,
        });

        console.log("✅ OTAKUDESU HOMEPAGE SAVED");

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