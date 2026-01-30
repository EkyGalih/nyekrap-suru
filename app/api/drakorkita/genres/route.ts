import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeGenres } from "@/src/lib/scrapers/drakorkita";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { redis } from "@/src/lib/redisCache";

export const runtime = "nodejs";

/* ===============================
   GET ALL GENRES
   Example:
   /api/drakorkita/genres
================================ */

export const GET = withAuth(async () => {
    try {
        const cacheKey = "drakorkita:genres";

        // ===============================
        // ✅ Redis Cache Check
        // ===============================
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("⚡ GENRES CACHE HIT");

            return NextResponse.json({
                message: "success (cache)",
                ...(cached as any),
            });
        }

        console.log("🔥 GENRES CACHE MISS → SCRAPING");

        // ===============================
        // Target URL
        // ===============================
        const url = `${process.env.DRAKORKITA_URL}/all`;

        // ===============================
        // Fetch HTML via Proxy
        // ===============================
        const html = await proxyFetchHTML(url);

        // ===============================
        // Scrape Genres
        // ===============================
        const datas = scrapeGenres(html);

        const payload = {
            total: datas.length,
            datas,
        };

        // ===============================
        // ✅ Save Cache (7 Hari)
        // ===============================
        await redis.set(cacheKey, payload, {
            ex: 604800, // ✅ 7 hari
        });

        console.log("✅ GENRES SAVED");

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