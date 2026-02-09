import { NextResponse } from "next/server"
import { getOrScrape } from "@/src/lib/anime/getOrScrape"
import { proxyFetchHTML } from "@/src/lib/proxyFetch"
import { scrapeAnimeSchedule } from "@/src/lib/scrapers/anime"

export const runtime = "nodejs"

export async function GET() {
    const data = await getOrScrape({
        cacheKey: "anime:jadwal",
        endpoint: "/jadwal/",
        ttl: 60 * 60 * 24, // ✅ 24 jam
        allowStaleOnError: true,

        scraper: async () => {
            const url = `${process.env.OTAKUDESU_URL}/jadwal-rilis/`
            const html = await proxyFetchHTML(url)
            return scrapeAnimeSchedule(html)
        },
    })

    return NextResponse.json({
        message: "cron ok",
        data,
    })
}