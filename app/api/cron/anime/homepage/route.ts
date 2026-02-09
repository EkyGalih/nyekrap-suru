import { NextResponse } from "next/server"
import { getOrScrape } from "@/src/lib/anime/getOrScrape"
import { proxyFetchHTML } from "@/src/lib/proxyFetch"
import { scrapeOtakudesuHome } from "@/src/lib/scrapers/anime"

export const runtime = "nodejs"

function assertCronSecret(req: Request) {
    const secret = req.headers.get("x-cron-secret")
    return secret && secret === process.env.CRON_SECRET
}

export async function GET(req: Request) {
    if (process.env.CRON_SECRET && !assertCronSecret(req)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await getOrScrape({
        cacheKey: "otakudesu:home",
        endpoint: "/",
        ttl: 60 * 60 * 24,
        scraper: async () => {
            const html = await proxyFetchHTML(process.env.OTAKUDESU_URL!)
            return scrapeOtakudesuHome(html)
        }
    })

    return NextResponse.json({ message: "cron ok", data })
}