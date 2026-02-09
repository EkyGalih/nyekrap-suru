import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"

import { getOrScrape } from "@/src/lib/anime/getOrScrape"
import { proxyFetchHTML } from "@/src/lib/proxyFetch"
import { scrapeAnimeGenreDetail } from "@/src/lib/scrapers/anime"

export const runtime = "nodejs"

export const GET = withAuth(async (_req, context) => {
  // ✅ Next.js 15+ params fix
  const { genre } = await context.params

  const data = await getOrScrape({
    cacheKey: `animes:genre:${genre}:page:1`,
    endpoint: `/genres/${genre}/`,
    ttl: 60 * 60 * 24, // ✅ 1 hari
    allowStaleOnError: true,

    scraper: async () => {
      const url = `${process.env.OTAKUDESU_URL}/genres/${genre}/`
      const html = await proxyFetchHTML(url)
      return scrapeAnimeGenreDetail(html, genre, 1)
    },
  })

  return NextResponse.json({
    message: "cron ok",
    genre,
    page: 1,
    data,
  })
})