import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "@/src/lib/headers";
import { scrapeOngoingSeries } from "@/src/lib/scrapers/drakorkita";

export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("page") ?? "1";

    const res = await axios.get<string>(
      `${process.env.DRAKORKITA_URL}/all?page=${page}&status=returning%20series`,
      { headers }
    );

    const data = await scrapeOngoingSeries(res);

    return NextResponse.json({
      message: "success",
      page: parseInt(page),
      ...data,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        message: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}