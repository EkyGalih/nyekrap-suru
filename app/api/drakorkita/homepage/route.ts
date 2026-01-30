import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeHomePage } from "@/src/lib/scrapers/drakorkita";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { redis } from "@/src/lib/redisCache";

export const runtime = "nodejs";

export const GET = withAuth(async () => {
  try {
    const cacheKey = "drakorkita:homepage";

    // ===============================
    // ✅ Redis Cache Check
    // ===============================
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("⚡ CACHE HIT (Redis)");

      return NextResponse.json({
        message: "success (cache)",
        data: cached, // ✅ langsung pakai object
      });
    }

    console.log("🔥 CACHE MISS → SCRAPING");

    // ===============================
    // Fetch HTML via ScraperAPI
    // ===============================
    const targetUrl = `${process.env.DRAKORKITA_URL}/`;
    const html = await proxyFetchHTML(targetUrl);

    // ===============================
    // Scrape Homepage
    // ===============================
    const result = scrapeHomePage(html);

    // ===============================
    // ✅ Save Cache to Redis (Object langsung)
    // ===============================
    await redis.set(cacheKey, result, {
      ex: 86400, // 1 hari
    });

    console.log("✅ HOMEPAGE SAVED");

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