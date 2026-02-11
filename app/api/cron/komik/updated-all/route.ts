import { NextResponse } from "next/server"

export const runtime = "nodejs"

const TIPES = ["manga", "manhwa", "manhua"]

export async function GET(req: Request) {
    const baseUrl = process.env.BASE_URL
    const cronSecret = process.env.CRON_SECRET

    for (const tipe of TIPES) {
        const url = `${baseUrl}/api/cron/komik/updated?tipe=${tipe}&page=1`

        console.log("CRON HIT:", url)

        await fetch(url, {
            headers: {
                "x-cron-secret": cronSecret!,
            },
        })
    }

    return NextResponse.json({
        message: "cron updated all done",
    })
}