import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"
import { proxyFetchHTML } from "@/src/lib/proxyFetch"
import { redis } from "@/src/lib/redisCache"
import { scrapeOtakudesuEpisode } from "@/src/lib/scrapers/anime"
import { getErrorMessage } from "@/src/lib/getErrorMessage"

export const runtime = "nodejs"

// TTL settings
const CACHE_TTL = 60 * 60        // 1 jam
const FAIL_TTL = 60 * 5          // 5 menit

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
      const failKey = `anime:streaming:fail:${normalizedSlug}`

      /* ===============================
         🚫 NEGATIVE CACHE CHECK
      =============================== */
      const failedRecently = await redis.get(failKey)
      if (failedRecently) {
        return NextResponse.json(
          { message: "streaming temporarily unavailable" },
          { status: 503 }
        )
      }

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

      /* ===============================
         🌐 FETCH HTML
      =============================== */
      const url = `${process.env.OTAKUDESU_URL}/episode/${normalizedSlug}/`
      const html = await proxyFetchHTML(url)

      /* ===============================
         🧠 SCRAPE
      =============================== */
      const result = scrapeOtakudesuEpisode(html)

      // ❌ jangan cache kalau iframe kosong
      if (!result.streaming_iframe) {
        await redis.set(failKey, true, { ex: FAIL_TTL })
        throw new Error("Iframe streaming tidak ditemukan")
      }

      /* ===============================
         💾 SAVE CACHE
      =============================== */
      await redis.set(cacheKey, result, {
        ex: CACHE_TTL,
      })

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