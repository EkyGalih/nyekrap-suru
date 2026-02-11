import { NextResponse } from "next/server"
import axios from "axios"
import { scrapeKomikuDetail } from "@/src/lib/scrapers/komik"
import { withAuth } from "@/src/lib/withAuth"

export const runtime = "nodejs"

export const GET = withAuth(async (
    req: Request,
    context: { params: Promise<{ endpoint: string }> }
) => {
    try {
        const { endpoint } = await context.params

        if (!endpoint) {
            return NextResponse.json(
                { message: "Endpoint required" },
                { status: 400 }
            )
        }

        const url = `${process.env.KOMIKU_URL2}/manga/${endpoint}/`

        console.log("FETCH DETAIL:", url)

        const { data: html } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                Accept: "text/html",
            },
        })

        const data = scrapeKomikuDetail(html, endpoint)

        return NextResponse.json({
            message: "success",
            data,
        })

    } catch (error: any) {
        console.error(error)

        return NextResponse.json(
            {
                message: "Failed to fetch detail",
                error: error.message,
            },
            { status: 500 }
        )
    }
})