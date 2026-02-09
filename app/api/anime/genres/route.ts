import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"
import { getFromCacheOnly } from "@/src/lib/anime/getFromCacheOnly"

export const runtime = "nodejs"

export const GET = withAuth(async () => {
    const data = await getFromCacheOnly("anime:genres")

    if (!data) {
        return NextResponse.json(
            { message: "cache empty, run cron genres" },
            { status: 503 }
        )
    }

    return NextResponse.json({
        message: "Success",
        data,
    })
})