import { NextResponse } from "next/server"
import { getOrScrape } from "@/src/lib/anime/getOrScrape"
import { scrapeOtakudesuDetail } from "@/src/lib/scrapers/anime"
import { withAuth } from "@/src/lib/withAuth"
import { fetchHTMLAnime } from "@/src/lib/fetchHtmlAnime"

export const runtime = "nodejs"

export const GET = withAuth(async (_req, context) => {
    const { slug } = await context.params

    const data = await getOrScrape({
        cacheKey: `anime:detail:${slug}`,
        endpoint: `/anime/${slug}/`,
        ttl: 60 * 60 * 24,
        allowStaleOnError: true,
        scraper: async () => {
            const url = `${process.env.OTAKUDESU_URL}/anime/${slug}/`
            const html = await fetchHTMLAnime(url)
            return scrapeOtakudesuDetail(html)
        }
    })

    return NextResponse.json({ message: "success", data })
});