import { NextResponse } from "next/server"
import { getOrScrape } from "@/src/lib/anime/getOrScrape"
import { proxyFetchHTML } from "@/src/lib/proxyFetch"
import { scrapeAnimeList } from "@/src/lib/scrapers/anime"

export const runtime = "nodejs"

export async function GET(req: Request) {
    const data = await getOrScrape({
        cacheKey: "anime:list-anime",
        endpoint: "/list-anime/",
        ttl: 60 * 60 * 24 * 7, // ✅ 7 hari
        allowStaleOnError: true,
        scraper: async () => {
            const url = `${process.env.OTAKUDESU_URL}/anime-list/`
            const html = await proxyFetchHTML(url)
            return scrapeAnimeList(html)
        },
    })

    return NextResponse.json({
        message: "cron ok",
        count: Array.isArray(data) ? data.length : undefined,
        data,
    })
}