import { setCache } from "@/src/lib/redisCache"
import { scrapeKomikuGenres } from "@/src/lib/scrapers/komik"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(req: Request) {
    const secret = req.headers.get("x-cron-secret")

    if (secret !== process.env.CRON_SECRET) {
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        const data = await scrapeKomikuGenres()

        // simpan 7 hari
        await setCache("komik:genres", data, 60 * 60 * 24 * 7)

        return NextResponse.json({
            message: "data komik genres success",
            total: data.length,
        })
    } catch (error: any) {
        return NextResponse.json(
            { message: "get data failed", error: error.message },
            { status: 500 }
        )
    }
}