import { NextResponse } from "next/server"
import { getOrScrape } from "@/src/lib/anime/getOrScrape"
import { proxyFetchHTML } from "@/src/lib/proxyFetch"
import { scrapeUpdatedKomik } from "@/src/lib/scrapers/komik"

export const runtime = "nodejs"

const VALID_TYPES = ["manga", "manhwa", "manhua"] as const

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)

    const tipe = searchParams.get("tipe") ?? "manga"
    const page = Number(searchParams.get("page") ?? "1")

    if (!VALID_TYPES.includes(tipe as any)) {
        return NextResponse.json(
            { message: "Invalid tipe parameter" },
            { status: 400 }
        )
    }

    const baseUrl =
        page > 1
            ? `https://api.komiku.org/manga/page/${page}/`
            : `https://api.komiku.org/manga/`

    const url = `${baseUrl}?orderby=modified&tipe=${tipe}`

    const cacheKey = `komik-${tipe}:updated:page:${page}`

    const data = await getOrScrape({
        cacheKey,
        endpoint: `/komik/${tipe}/updated`,
        ttl: 60 * 60 * 24, // 1 hari
        allowStaleOnError: true,
        scraper: async () => {
            const html = await proxyFetchHTML(url)
            return scrapeUpdatedKomik(html)
        },
    })

    return NextResponse.json({
        message: "cron updated saved",
        tipe,
        page,
        total: Array.isArray(data) ? data.length : 0,
    })
}