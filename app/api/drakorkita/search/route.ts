import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { scrapeSearch } from "@/scrapers/drakorkita";
import { headers } from "@/src/lib/headers";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q");
    const page = req.nextUrl.searchParams.get("page") || "1";

    if (!q) {
      return NextResponse.json(
        { message: "keyword required" },
        { status: 400 }
      );
    }

    const axiosRequest = await axios.get(
      `${process.env.DRAKORKITA_URL}/all?q=${q}&page=${page}`,
      { headers }
    );

    const datas = await scrapeSearch(axiosRequest);

    return NextResponse.json({
      message: "success",
      keyword: q,
      datas: datas.datas,
      pagination: datas.pagination,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "error", error: error.message },
      { status: 500 }
    );
  }
}