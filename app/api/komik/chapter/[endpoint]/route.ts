import { scrapeKomikuChapter } from "@/src/lib/scrapers/komik"
import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"
import { getCache, redis, setCache } from "@/src/lib/redisCache"

export const runtime = "nodejs"

interface Context {
    params: Promise<{ endpoint: string }>
}

export const GET = withAuth(
    async (req: Request, context: Context) => {
        const { endpoint } = await context.params

        if (!endpoint) {
            return NextResponse.json(
                { message: "Endpoint required" },
                { status: 400 }
            )
        }

        const cacheKey = `chapter:${endpoint}`
        const lockKey = `lock:${cacheKey}`

        // =========================
        // 1️⃣ CHECK CACHE
        // =========================
        const cached = await getCache(cacheKey)
        if (cached) {
            return NextResponse.json({
                message: "success (cached)",
                data: cached,
            })
        }

        // =========================
        // 2️⃣ PREVENT DOUBLE SCRAPE
        // =========================
        const isLocked = await redis.get(lockKey)

        if (isLocked) {
            return NextResponse.json(
                { message: "Chapter is being generated, try again" },
                { status: 429 }
            )
        }

        // Lock for 60 seconds
        await redis.set(lockKey, "1", { ex: 60 })

        try {
            const baseUrl = process.env.KOMIKU_URL2!

            const data = await scrapeKomikuChapter(endpoint, baseUrl)

            // Cache 3 hari
            await setCache(cacheKey, data, 60 * 60 * 24 * 3)

            return NextResponse.json({
                message: "success (fresh)",
                data,
            })
        } finally {
            await redis.del(lockKey)
        }
    }
)