import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "@/src/lib/headers";
import { scrapeDetailGenres } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";

/* ===============================
   GET DRAMA BY GENRE
   Example:
   /api/drakorkita/genres/history?page=1
================================ */

export const GET = withAuth(
    async (
        req: NextRequest,
        { params }: { params: Promise<{ endpoint: string }> }
    ) => {
        try {
            // ✅ unwrap params (Next.js 16 fix)
            const { endpoint } = await params;

            // ✅ page query
            const page = req.nextUrl.searchParams.get("page") ?? "1";

            // ===============================
            // Genre Normalization
            // Website butuh format Capitalized
            // history → History
            // action-drama → Action Drama
            // ===============================
            const genre = endpoint
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

            // ===============================
            // Build URL
            // ===============================
            const url = `${process.env.DRAKORKITA_URL}/all?genre=${encodeURIComponent(
                genre
            )}&page=${page}`;

            console.log("FETCH GENRE URL:", url);

            // ===============================
            // Request ke Drakorkita
            // ===============================
            const response = await axios.get<string>(url, { headers });

            // ===============================
            // Scrape Result
            // ===============================
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
);