import axios from "axios";
import { NextResponse } from "next/server";

import { headers } from "@/src/lib/headers";
import { scrapeGenres } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";

/* ===============================
   GET ALL GENRES
   Example:
   /api/drakorkita/genres
================================ */

export const GET = withAuth(async () => {
    try {
        // ===============================
        // Request ke Drakorkita
        // ===============================
        const response = await axios.get<string>(
            `${process.env.DRAKORKITA_URL}/all`,
            { headers }
        );

        // ===============================
        // Scrape Genre List
        // ===============================
        const datas = await scrapeGenres(response);

        return NextResponse.json({
            message: "success",
            total: datas.length,
            datas,
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