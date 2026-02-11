import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"
import { getCache, setCache } from "@/src/lib/redisCache"
import { scrapeKomikuDaftar } from "@/src/lib/scrapers/komik"

export const runtime = "nodejs"

export const GET = withAuth(async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url)

        const tipe = searchParams.get("tipe") || ""
        const huruf = searchParams.get("huruf") || ""
        const page = parseInt(searchParams.get("page") || "1")

        const cacheKey = `komiku:daftar:${tipe}:${huruf}:${page}`

        const cached = await getCache(cacheKey)
        if (cached) {
            return NextResponse.json({
                message: "success (cache)",
                ...cached,
            })
        }

        const baseUrl = `${process.env.KOMIKU_URL2}/daftar-komik/`
        const params = new URLSearchParams()

        if (tipe) params.set("tipe", tipe)
        if (huruf) params.set("huruf", huruf)
        if (page > 1) params.set("halaman", page)

        const url = `${baseUrl}?${params.toString()}`

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
            cache: "no-store",
        })

        const html = await response.text()

        const result = scrapeKomikuDaftar(html)

        const finalResult = {
            tipe,
            huruf,
            page,
            pagination: result.pagination,
            total: result.datas.length,
            datas: result.datas,
        }

        await setCache(cacheKey, finalResult, 3600)

        return NextResponse.json({
            message: "success",
            ...finalResult,
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                message: "Failed to scrape daftar",
                error: error.message,
            },
            { status: 500 }
        )
    }
})