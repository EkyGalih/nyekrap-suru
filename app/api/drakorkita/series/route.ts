import { NextRequest, NextResponse } from "next/server";

import { scrapeSeries } from "@/src/lib/scrapers/drakorkita";
import { getErrorMessage } from "@/src/lib/getErrorMessage";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { redis } from "@/src/lib/redisCache";

export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const page = req.nextUrl.searchParams.get("page") ?? "1";
    const currentPage = Number(page);

    const cacheKey = `drakorkita:series:page:${page}`;

    // ===============================
    // ✅ Redis Cache Check
    // ===============================
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("⚡ SERIES CACHE HIT:", cacheKey);

      return NextResponse.json({
        message: "success (cache)",
        ...(cached as any),
      });
    }

    console.log("🔥 SERIES CACHE MISS → SCRAPING");

    // ===============================
    // Fetch HTML via ScraperAPI
    // ===============================
    const url = `${process.env.DRAKORKITA_URL}/all?media_type=tv&page=${page}`;
    const html = await proxyFetchHTML(url);

    // ===============================
    // Scrape Result
    // ===============================
    const result = scrapeSeries(html);

    const totalPage = result.pagination;

    const payload = {
      page: currentPage,
      pagination: totalPage,
      datas: result.datas,
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
    // ✅ Save Cache Direct Object (NO stringify)
    // ===============================
    await redis.set(cacheKey, payload, {
      ex: 21600, // ✅ 6 jam
    });

    console.log("✅ SERIES SAVED:", cacheKey);

    return NextResponse.json({
      message: "success",
      ...payload,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "error",
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
});