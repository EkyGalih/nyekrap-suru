import { NextRequest } from "next/server";

import { scrapeOngoingSeries } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";

import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
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
    // Target URL (Ongoing)
    // ===============================
    const url = `${process.env.DRAKORKITA_URL}/all?status=returning%20series&page=${page}`;

    // ===============================
    // Fetch HTML via Proxy
    // ===============================
    const html = await proxyFetchHTML(url);

    // ===============================
    // Scrape Result
    // ===============================
    const result = scrapeOngoingSeries(html);

    const totalPage = result.pagination;

    // ===============================
    // Return JSON + Cache (Revalidate)
    // ===============================
    return jsonCache(
      {
        message: "success",
        page: currentPage,
        pagination: totalPage,
        datas: result.datas,

        filters: result.filters,
        sidebar: result.sidebar,

        pagination_info: {
          current_page: currentPage,
          total_page: totalPage,
          has_next: currentPage < totalPage,
          has_prev: currentPage > 1,
          next_page: currentPage < totalPage ? currentPage + 1 : null,
          prev_page: currentPage > 1 ? currentPage - 1 : null,
        },
      },
      300 // ✅ cache 5 menit
    );
  } catch (err: unknown) {
    return jsonCache(
      {
        message: "error",
        error: getErrorMessage(err),
      },
      500
    );
  }
});