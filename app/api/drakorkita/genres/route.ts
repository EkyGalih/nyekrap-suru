import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeGenres } from "@/src/lib/scrapers/drakorkita";
import { jsonCache } from "@/src/lib/jsonCache";
import { getErrorMessage } from "@/src/lib/getErrorMessage";

export const runtime = "nodejs";

export const GET = withAuth(async () => {
    try {
        // ===============================
        // Target URL Drakorkita
        // ===============================
        const url = `${process.env.DRAKORKITA_URL}/all`;

        // ===============================
        // Fetch HTML via Proxy
        // ===============================
        const html = await proxyFetchHTML(url);

        // ===============================
        // Scrape Genre List
        // ===============================
        const datas = scrapeGenres(html);

        // ===============================
        // Return Cached JSON
        // ===============================
        return jsonCache(
            {
                message: "success",
                total: datas.length,
                datas,
            },
            300
        );
    } catch (err: unknown) {
        return NextResponse.json(
            {
                message: "error",
                error: getErrorMessage(err),
            },
            { status: 500 }
        );
    }
});