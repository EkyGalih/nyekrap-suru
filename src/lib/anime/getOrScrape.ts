import { prisma } from "@/src/lib/prisma"

type GetOrScrapeParams<T> = {
    cacheKey: string
    endpoint: string
    ttl: number
    scraper: () => Promise<T>
    allowStaleOnError?: boolean // ✅ baru
}

export async function getOrScrape<T>({
    cacheKey,
    endpoint,
    ttl,
    scraper,
    allowStaleOnError = true,
}: GetOrScrapeParams<T>): Promise<T> {
    const now = new Date()

    const cache = await prisma.scrapeCache.findUnique({
        where: { cacheKey },
    })

    // fresh hit
    if (cache && cache.expiresAt > now) {
        console.log("⚡ DB CACHE HIT:", cacheKey)
        return cache.data as T
    }

    console.log("🔥 DB CACHE MISS → SCRAPING:", cacheKey)

    try {
        const data = await scraper()
        const expiresAt = new Date(Date.now() + ttl * 1000)

        await prisma.scrapeCache.upsert({
            where: { cacheKey },
            update: { data: data as any, scrapedAt: now, expiresAt },
            create: { cacheKey, endpoint, data: data as any, expiresAt },
        })

        return data
    } catch (err: any) {
        console.error("⨯ SCRAPE FAILED:", cacheKey, err?.message)

        // ✅ fallback ke cache lama walaupun expired
        if (allowStaleOnError && cache?.data) {
            console.log("🟨 RETURNING STALE CACHE:", cacheKey)
            return cache.data as T
        }

        throw err
    }
}