import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { redis } from "@/src/lib/redisCache";
import { scrapeAnimeList } from "@/src/lib/scrapers/anime";

export const runtime = "nodejs";

export const GET = withAuth(async () => {
  try {
    const cacheKey = "anime:anime-list";

    /* ===============================
       ✅ Redis Cache Check
    =============================== */
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("⚡ ANIME LIST CACHE HIT");

      return NextResponse.json({
        message: "success (cache)",
        data: cached,
      });
    }

    console.log("🔥 CACHE MISS → SCRAPING LIST");

    /* ===============================
       ✅ Fetch HTML via Proxy
    =============================== */
    const targetUrl = `${process.env.OTAKUDESU_URL}/anime-list/`;
    const html = await proxyFetchHTML(targetUrl);

    /* ===============================
       ✅ Scrape Result
    =============================== */
    const result = scrapeAnimeList(html);

    /* ===============================
       ✅ Save Cache (12 jam)
    =============================== */
    await redis.set(cacheKey, result, {
      ex: 43200,
    });

    console.log("✅ ANIME LIST SAVED");

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