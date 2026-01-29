import { NextRequest, NextResponse } from "next/server";

import { scrapeMovie } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { jsonCache } from "@/src/lib/jsonCache";

export const runtime = "nodejs";

/* ===============================
   GET ALL MOVIES
   Example:
   /api/drakorkita/movie?page=1
================================ */

export const GET = withAuth(async (req: NextRequest) => {
    try {
        const page = req.nextUrl.searchParams.get("page") ?? "1";
        const currentPage = Number(page);

        const url = `${process.env.DRAKORKITA_URL}/all?media_type=movie&page=${page}`;

        // ✅ Fetch HTML via Proxy
        const html = await proxyFetchHTML(url);

        // ✅ Scrape langsung dari HTML string
        const result = scrapeMovie(html);

        return jsonCache(
            {
                message: "success",
                page: currentPage,
                pagination: result.pagination,
                total: result.datas.length,
                datas: result.datas,

                pagination_info: {
                    current_page: currentPage,
                    total_page: result.pagination,
                    has_next: currentPage < result.pagination,
                    has_prev: currentPage > 1,
                    next_page:
                        currentPage < result.pagination ? currentPage + 1 : null,
                    prev_page: currentPage > 1 ? currentPage - 1 : null,
                },
            },
            300
        );
    } catch (err: unknown) {
        return NextResponse.json(
            {
                message: "error",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    }
});