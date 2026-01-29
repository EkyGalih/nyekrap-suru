import { NextRequest, NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { jsonCache } from "@/src/lib/jsonCache";

import { scrapeDetailAllType } from "@/src/lib/scrapers/drakorkita";

export const runtime = "nodejs";

export const GET = withAuth(
    async (
        _req: NextRequest,
        { params }: { params: Promise<{ endpoint: string }> }
    ) => {
        try {
            const { endpoint } = await params;

            const url = `${process.env.DRAKORKITA_URL}/detail/${endpoint}`;

            // ✅ Fetch HTML via Proxy
            const html = await proxyFetchHTML(url);

            // ✅ Scrape detail from HTML string
            const data = await scrapeDetailAllType(endpoint, html);

            return jsonCache(
                {
                    message: "success",
                    data,
                },
                600
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
    }
);