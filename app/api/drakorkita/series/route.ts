import { NextRequest, NextResponse } from "next/server";

import { scrapeSeries } from "@/src/lib/scrapers/drakorkita";
import { getErrorMessage } from "@/src/lib/getErrorMessage";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { jsonCache } from "@/src/lib/jsonCache";

export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    // ===============================
    // Query Params
    // ===============================
    const page = req.nextUrl.searchParams.get("page") ?? "1";
    const currentPage = Number(page);

    // ===============================
    // Target URL
    // ===============================
    const url = `${process.env.DRAKORKITA_URL}/all?media_type=tv&page=${page}`;

    // ===============================
    // Fetch HTML via Proxy
    // ===============================
    const html = await proxyFetchHTML(url);

    // ===============================
    // Scrape Result
    // ===============================
    const result = scrapeSeries(html);

    const totalPage = result.pagination;

    // ===============================
    // Response JSON + Cache Revalidate
    // ===============================
    return jsonCache(
      {
        message: "success",
        page: currentPage,
        pagination: totalPage,
        datas: result.datas,

        pagination_info: {
          current_page: currentPage,
          total_page: totalPage,
          has_next: currentPage < totalPage,
          has_prev: currentPage > 1,
          next_page: currentPage < totalPage ? currentPage + 1 : null,
          prev_page: currentPage > 1 ? currentPage - 1 : null,
        },
      },

      // ✅ Cache 5 menit
      300
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "error",
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
});