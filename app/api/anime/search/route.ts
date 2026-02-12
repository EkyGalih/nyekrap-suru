import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"
import { redis } from "@/src/lib/redisCache"
import { scrapeAnimeSearch } from "@/src/lib/scrapers/anime"
import { fetchHTMLAnime } from "@/src/lib/fetchHtmlAnime"

export const runtime = "nodejs"

export const GET = withAuth(async (req) => {
    const { searchParams } = new URL(req.url)
    const rawQ = searchParams.get("q")

    if (!rawQ) {
        return NextResponse.json(
            { message: "Query parameter 'q' is required" },
            { status: 400 }
        )
    }

    const q = rawQ.trim().toLowerCase()
    const cacheKey = `anime:search:${q}`

    const cached = await redis.get(cacheKey)
    if (cached) {
        console.log("⚡ SEARCH CACHE HIT:", q)
        return NextResponse.json({ message: "success (cache)", data: cached })
    }

    console.log("🔥 SEARCH CACHE MISS → SCRAPING:", q)

    const targetUrl =
        `${process.env.OTAKUDESU_URL}/?s=${encodeURIComponent(q)}&post_type=anime`

    const html = await fetchHTMLAnime(targetUrl)
    const result = scrapeAnimeSearch(html, q)

    // ✅ TTL 3 jam
    await redis.set(cacheKey, result, {
        ex: 60 * 60 * 3,
    })

    return NextResponse.json({ message: "success", data: result })
})