import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"
import { getFromCacheOnly } from "@/src/lib/anime/getFromCacheOnly"

export const runtime = "nodejs"

export const GET = withAuth(async () => {
    const data = await getFromCacheOnly("anime:jadwal")

    if (!data) {
        return NextResponse.json(
            { message: "schedule cache empty, run cron" },
            { status: 503 }
        )
    }

    return NextResponse.json({
        message: "Success",
        data,
    })
})