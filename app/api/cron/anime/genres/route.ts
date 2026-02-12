import { NextResponse } from "next/server"
import { getOrScrape } from "@/src/lib/anime/getOrScrape"
import { scrapeAnimeGenres } from "@/src/lib/scrapers/anime"
import { fetchHTMLAnime } from "@/src/lib/fetchHtmlAnime"

export const runtime = "nodejs"

function assertCronSecret(req: Request) {
    const secret = req.headers.get("x-cron-secret")
    if (!process.env.CRON_SECRET) return true
    return secret === process.env.CRON_SECRET
}

export async function GET(req: Request) {
    if (process.env.CRON_SECRET && !assertCronSecret(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await getOrScrape({
        cacheKey: "anime:genres",
        endpoint: "/genres",
        ttl: 60 * 60 * 24 * 7, // ✅ 7 hari
        allowStaleOnError: true,
        scraper: async () => {
            const url = `${process.env.OTAKUDESU_URL}/genre-list/`
            const html = await fetchHTMLAnime(url)
            return scrapeAnimeGenres(html)
        },
    })

    return NextResponse.json({ message: "cron ok", data })
}