import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "@/src/lib/headers";
import { scrapeSearch } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";

/* ===============================
   SEARCH DRAMA / MOVIE
   Example:
   /api/drakorkita/search?q=revenge&page=1
================================ */

export const GET = withAuth(async (req: NextRequest) => {
    try {
        // ✅ Ambil keyword query
        const keyword = req.nextUrl.searchParams.get("q");

        if (!keyword) {
            return NextResponse.json(
                {
                    message: "Keyword wajib diisi",
                    error: "Silakan tambahkan parameter ?q=...",
                },
                { status: 400 }
            );
        }

        // ✅ Page default
        const page = req.nextUrl.searchParams.get("page") ?? "1";
        const currentPage = Number(page);

        // ===============================
        // Request ke Drakorkita Search Page
        // ===============================
        const response = await axios.get<string>(
            `${process.env.DRAKORKITA_URL}/all?q=${encodeURIComponent(
                keyword
            )}&page=${page}`,
            { headers }
        );

        // ===============================
        // Scrape Data
        // ===============================
        const result = await scrapeSearch(response);

        // ===============================
        // Response API
        // ===============================
        return NextResponse.json({
            message: "success",
            keyword,
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
});