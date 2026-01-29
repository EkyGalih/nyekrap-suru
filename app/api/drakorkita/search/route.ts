import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "@/src/lib/headers";
import { scrapeSearch } from "@/src/lib/scrapers/drakorkita";

export async function GET(req: NextRequest) {
    try {
        const keyword = req.nextUrl.searchParams.get("q");

        if (!keyword) {
            return NextResponse.json(
                { message: "Keyword wajib diisi" },
                { status: 400 }
            );
        }

        const page = req.nextUrl.searchParams.get("page") ?? "1";

        // Request ke Drakorkita Search Page
        const response = await axios.get<string>(
            `${process.env.DRAKORKITA_URL}/all?q=${keyword}&page=${page}`,
            { headers }
        );

        // Scrape Data
        const result = await scrapeSearch(response);

        return NextResponse.json({
            message: "success",
            keyword,
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