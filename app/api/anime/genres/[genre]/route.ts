import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { redis } from "@/src/lib/redisCache";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { scrapeAnimeGenreDetail } from "@/src/lib/scrapers/anime";

export const runtime = "nodejs";

export const GET = withAuth(async (req, context) => {
  try {
    /* ===============================
       ✅ Params Fix (Next 15+)
    =============================== */
    const { genre } = await context.params;

    /* ===============================
       ✅ Query Page
    =============================== */
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");

    /* ===============================
       ✅ Cache Key
    =============================== */
    const cacheKey = `animes:genre:${genre}:page:${page}`;

    /* ===============================
       ✅ Redis Cache Check
    =============================== */
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("⚡ GENRE CACHE HIT");

      return NextResponse.json({
        message: "success (cache)",
        data: cached,
      });
    }

    console.log("🔥 GENRE CACHE MISS → SCRAPING");

    /* ===============================
       ✅ Target URL
    =============================== */
    const targetUrl =
      page === 1
        ? `${process.env.OTAKUDESU_URL}/genres/${genre}/`
        : `${process.env.OTAKUDESU_URL}/genres/${genre}/page/${page}/`;

    /* ===============================
       ✅ Fetch HTML via Proxy
    =============================== */
    const html = await proxyFetchHTML(targetUrl);

    /* ===============================
       ✅ Scrape Result
    =============================== */
    const result = scrapeAnimeGenreDetail(html, genre, page);

    /* ===============================
       ✅ Save Cache (12 jam)
    =============================== */
    await redis.set(cacheKey, result, {
      ex: 43200,
    });

    console.log("✅ GENRE SAVED");

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