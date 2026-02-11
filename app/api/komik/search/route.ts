import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"
import { scrapeKomikuSearch } from "@/src/lib/scrapers/komik"
import { getCache, setCache } from "@/src/lib/redisCache"

export const runtime = "nodejs"

export const GET = withAuth(async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url)

        const query = searchParams.get("q")

        if (!query) {
            return NextResponse.json(
                { message: "Query (q) required" },
                { status: 400 }
            )
        }

        const cacheKey = `komiku:search:${query}`

        const cached = await getCache(cacheKey)
        if (cached) {
            return NextResponse.json({
                message: "success (cache)",
                ...cached,
            })
        }

        const url = `${process.env.KOMIKU_URL}?post_type=manga&s=${encodeURIComponent(query)}`

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
            cache: "no-store",
        })

        const html = await response.text()

        const result = scrapeKomikuSearch(html)

        await setCache(cacheKey, result, 3600)

        return NextResponse.json({
            message: "success",
            ...result,
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                message: "Failed to search",
                error: error.message,
            },
            { status: 500 }
        )
    }
})