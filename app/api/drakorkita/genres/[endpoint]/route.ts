import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "@/src/lib/headers";
import { scrapeDetailGenres } from "@/src/lib/scrapers/drakorkita";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ endpoint: string }> }
) {
  try {
    // ✅ unwrap params (Next.js 15 fix)
    const { endpoint } = await context.params;

    const page = req.nextUrl.searchParams.get("page") ?? "1";

    // ✅ Genre harus Capital sesuai website
    const genre =
      endpoint.charAt(0).toUpperCase() + endpoint.slice(1);

    const url = `${process.env.DRAKORKITA_URL}/all?genre=${encodeURIComponent(
      genre
    )}&page=${page}`;

    console.log("FETCH URL:", url);

    const response = await axios.get<string>(url, { headers });

    const result = await scrapeDetailGenres(response);

    return NextResponse.json({
      message: "success",
      genre,
      page: Number(page),
      pagination: result.pagination,
      total: result.datas.length,
      datas: result.datas,
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