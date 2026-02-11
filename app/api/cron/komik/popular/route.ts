import { NextResponse } from "next/server"
import { getOrScrape } from "@/src/lib/anime/getOrScrape"
import { proxyFetchHTML } from "@/src/lib/proxyFetch"
import { scrapeHotKomiku } from "@/src/lib/scrapers/komik"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const secret = req.headers.get("x-cron-secret")

  if (secret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 })
  }
  
  const { searchParams } = new URL(req.url)

  const tipe = searchParams.get("tipe") ?? "manga"
  const page = Number(searchParams.get("page") ?? "1")

  const baseUrl =
    page > 1
      ? `${process.env.KOMIKU_URL}/other/hot/page/${page}/`
      : `${process.env.KOMIKU_URL}/other/hot/`

  const url = `${baseUrl}?tipe=${tipe}`

  const cacheKey = `komik-popular:${tipe}:page:${page}`

  const data = await getOrScrape({
    cacheKey,
    endpoint: `/komik/popular/${tipe}/${page}`,
    ttl: 60 * 60 * 6, // 6 jam
    allowStaleOnError: true,
    scraper: async () => {
      const html = await proxyFetchHTML(url)
      return scrapeHotKomiku(html)
    },
  })

  return NextResponse.json({
    message: "cron komik popular ok",
    tipe,
    page,
    count: data.length,
  })
}