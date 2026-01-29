import { NextRequest, NextResponse } from "next/server";

import { scrapeMovie } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";

/* ===============================
   GET ALL MOVIES
   Example:
   /api/drakorkita/movie?page=1
================================ */

export const GET = withAuth(async (req: NextRequest) => {
    try {
        // ✅ page query
        const page = req.nextUrl.searchParams.get("page") ?? "1";
        const currentPage = Number(page);

        // ===============================
        // Request ke Drakorkita
        // ===============================
        const url = `${process.env.DRAKORKITA_URL}/all?media_type=movie&page=${page}`;
        const html = await proxyFetchHTML(url);

        // ===============================
        // Scrape Result
        // ===============================
        const result = await scrapeMovie({ data: html } as any);

        // ===============================
        // Response API
        // ===============================
        return NextResponse.json({
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
                next_page: currentPage < result.pagination ? currentPage + 1 : null,
                prev_page: currentPage > 1 ? currentPage - 1 : null,
            },
        },
            {
                headers: {
                    "Cache-Control": "s-maxage=600, stale-while-revalidate=180",
                },
            }
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