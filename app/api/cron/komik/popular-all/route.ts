import { NextResponse } from "next/server"

export const runtime = "nodejs"

const TIPES = ["manga", "manhwa", "manhua"]

export async function GET() {
  const baseUrl = process.env.BASE_URL

  if (!baseUrl) {
    return NextResponse.json(
      { message: "BASE_URL not set" },
      { status: 500 }
    )
  }

  for (const tipe of TIPES) {
    const url = `${baseUrl}/api/cron/komik/popular?tipe=${tipe}&page=1`

    await fetch(url, {
      headers: {
        "x-cron-secret": process.env.CRON_SECRET!,
      },
    })
  }

  return NextResponse.json({
    message: "cron popular all success",
    types: TIPES,
  })
}