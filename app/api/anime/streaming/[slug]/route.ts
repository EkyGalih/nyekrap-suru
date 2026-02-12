import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"
import { redis } from "@/src/lib/redisCache"
import { scrapeOtakudesuEpisode } from "@/src/lib/scrapers/anime"
import { getErrorMessage } from "@/src/lib/getErrorMessage"
import { fetchHTMLAnime } from "@/src/lib/fetchHtmlAnime"

export const runtime = "nodejs"

const CACHE_TTL = 60 * 60 // 1 jam

export const GET = withAuth(
  async (_req, { params }: { params: Promise<{ slug: string }> }) => {
    try {
      const { slug } = await params
      if (!slug) {
        return NextResponse.json(
          { message: "error", error: "Slug wajib ada" },
          { status: 400 }
        )
      }

      const normalizedSlug = slug.trim().toLowerCase()
      const cacheKey = `anime:streaming:${normalizedSlug}`

      /* ===============================
         ⚡ CACHE HIT
      =============================== */
      const cached = await redis.get(cacheKey)
      if (cached) {
        return NextResponse.json({
          message: "success (cache)",
          data: cached,
        })
      }

      const url = `${process.env.OTAKUDESU_URL}/episode/${normalizedSlug}/`

      /* ===============================
         🔁 SCRAPE WITH RETRY
      =============================== */
      let result: any = null

      for (let attempt = 0; attempt < 2; attempt++) {
        const html = await fetchHTMLAnime(url)
        result = scrapeOtakudesuEpisode(html)

        if (result?.streaming_iframe) break

        // delay sebelum retry
        await new Promise(r => setTimeout(r, 800))
      }

      if (!result?.streaming_iframe) {
        return NextResponse.json(
          { message: "streaming unavailable" },
          { status: 503 }
        )
      }

      /* ===============================
         💾 SAVE CACHE
      =============================== */
      await redis.set(cacheKey, result, { ex: CACHE_TTL })

      return NextResponse.json({
        message: "success",
        data: result,
      })
    } catch (err: unknown) {
      return NextResponse.json(
        {
          message: "error",
          error: getErrorMessage(err),
        },
        { status: 500 }
      )
    }
  }
)