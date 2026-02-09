import { prisma } from "@/src/lib/prisma"

export async function getFromCacheOnly<T>(cacheKey: string): Promise<T | null> {
    const now = new Date()
    const cache = await prisma.scrapeCache.findUnique({ where: { cacheKey } })

    console.log("🟦 DB READ:", cacheKey, {
        found: !!cache,
        expiresAt: cache?.expiresAt?.toISOString(),
        now: now.toISOString(),
    })

    if (!cache) return null
    if (cache.expiresAt <= now) return null

    console.log("✅ DB CACHE HIT:", cacheKey)
    return cache.data as T
}