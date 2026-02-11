import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"
import { getFromCacheOnly } from "@/src/lib/anime/getFromCacheOnly"

export const runtime = "nodejs"

export const GET = withAuth(async (req: Request) => {
  const { searchParams } = new URL(req.url)

  const tipe = searchParams.get("tipe") ?? "manga"
  const page = Number(searchParams.get("page") ?? "1")

  const cacheKey = `komik-popular:${tipe}:page:${page}`

  const data = await getFromCacheOnly(cacheKey)

  if (!data) {
    return NextResponse.json(
      { message: "cache empty, run cron komiku hot" },
      { status: 503 }
    )
  }

  return NextResponse.json({
    message: "success",
    tipe,
    page,
    total: data.length,
    data,
  })
})