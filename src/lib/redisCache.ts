import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/* ===============================
   GET CACHE
================================ */
export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get<T>(key)
  return data ?? null
}

/* ===============================
   SET CACHE + TTL
================================ */
export async function setCache(
  key: string,
  value: any,
  ttlSeconds: number = 3600
) {
  await redis.set(key, value, {
    ex: ttlSeconds,
  })
}