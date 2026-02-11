import { NextResponse } from "next/server"
import axios from "axios"
import { withAuth } from "@/src/lib/withAuth"
import { scrapeDetailGenre } from "@/src/lib/scrapers/komik"

export const runtime = "nodejs"

type Context = {
    params: Promise<{
        endpoint: string
    }>
}

export const GET = withAuth(async (
    req: Request,
    context: Context
) => {
    try {
        const { endpoint } = await context.params
        const { searchParams } = new URL(req.url)

        const tipe = searchParams.get("tipe") ?? undefined

        if (!endpoint) {
            return NextResponse.json(
                { message: "Endpoint required" },
                { status: 400 }
            )
        }

        const allowedTipe = ["manga", "manhwa", "manhua"]

        if (tipe && !allowedTipe.includes(tipe)) {
            return NextResponse.json(
                { message: "Invalid tipe. Use manga | manhwa | manhua" },
                { status: 400 }
            )
        }

        const baseUrl = `${process.env.KOMIKU_URL}/genre/${endpoint}/`

        const params = new URLSearchParams({
            orderby: "modified",
        })

        if (tipe) {
            params.append("tipe", tipe)
        }

        const url = `${baseUrl}?${params.toString()}`

        console.log("FETCH GENRE:", url)

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        })

        const result = scrapeDetailGenre(response.data)

        return NextResponse.json({
            message: "success",
            endpoint,
            tipe: tipe ?? "all",
            ...result,
        })

    } catch (error: any) {
        console.error(error)

        return NextResponse.json(
            {
                message: "Failed to fetch genre",
                error: error?.message ?? "unknown error",
            },
            { status: 500 }
        )
    }
})