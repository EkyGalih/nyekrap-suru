import { NextResponse } from "next/server"
import { withAuth } from "@/src/lib/withAuth"
import { getCache } from "@/src/lib/redisCache"

export const runtime = "nodejs"

export const GET = withAuth(async () => {
    const data = await getCache("komik:genres")

    if (!data) {
        return NextResponse.json(
            { message: "cache empty, wait for update" },
            { status: 503 }
        )
    }

    return NextResponse.json({
        message: "success",
        total: data.length,
        data,
    })
})