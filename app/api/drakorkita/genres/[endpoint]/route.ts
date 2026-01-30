import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeDetailGenres } from "@/src/lib/scrapers/drakorkita";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { redis } from "@/src/lib/redisCache";

export const runtime = "nodejs";

/* ===============================
   GET DRAMA BY GENRE
   Example:
   /api/drakorkita/genres/history?page=1
================================ */

export const GET = withAuth(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ endpoint: string }> }
  ) => {
    try {
      // ✅ unwrap params
      const { endpoint } = await params;

      // ✅ query page
      const page = req.nextUrl.searchParams.get("page") ?? "1";

      // ===============================
      // Genre Normalization
      // history → History
      // action-drama → Action Drama
      // ===============================
      const genre = endpoint
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      // ===============================
      // ✅ Cache Key per Genre + Page
      // ===============================
      const cacheKey = `drakorkita:genre:${endpoint}:page:${page}`;

      // ===============================
      // ✅ Redis Cache Check
      // ===============================
      const cached = await redis.get(cacheKey);

      if (cached) {
        console.log("⚡ GENRE CACHE HIT:", cacheKey);

        return NextResponse.json({
          message: "success (cache)",
          ...(cached as any),
        });
      }

      console.log("🔥 GENRE CACHE MISS → SCRAPING:", cacheKey);

      // ===============================
      // Build Target URL
      // ===============================
      const url = `${process.env.DRAKORKITA_URL}/all?genre=${encodeURIComponent(
        genre
      )}&page=${page}`;

      // ===============================
      // Fetch HTML via Proxy
      // ===============================
      const html = await proxyFetchHTML(url);

      // ===============================
      // Scrape Result
      // ===============================
      const result = scrapeDetailGenres(html);

      const payload = {
        genre,
        page: Number(page),
        pagination: result.pagination,
        total: result.datas.length,
        datas: result.datas,
      };

      // ===============================
      // ✅ Save Cache (7 Hari)
      // ===============================
      await redis.set(cacheKey, payload, {
        ex: 604800, // ✅ 7 hari
      });

      console.log("✅ GENRE SAVED:", cacheKey);

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
  }
);