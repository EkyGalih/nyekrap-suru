import { NextResponse } from "next/server"
import { prisma } from "@/src/lib/prisma"
import { withAuth } from "@/src/lib/withAuth";

export const runtime = "nodejs"

export const GET = withAuth(async () => {
  const cacheKey = "anime:home"
  const cache = await prisma.scrapeCache.findUnique({ where: { cacheKey } })

  if (!cache) {
    return NextResponse.json({ message: "cache empty, run cron first" }, { status: 503 })
  }

  const now = new Date()
  if (cache.expiresAt <= now) {
    return NextResponse.json({ message: "cache expired, run cron" }, { status: 503 })
  }

  return NextResponse.json({
    message: "success",
    // meta: {
    //   cacheKey,
    //   scrapedAt: cache.scrapedAt?.toISOString?.() ?? null,
    //   expiresAt: cache.expiresAt.toISOString(),
    // },
    data: cache.data,
  })
});