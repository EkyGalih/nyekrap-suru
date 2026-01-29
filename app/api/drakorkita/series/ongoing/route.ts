import { NextRequest, NextResponse } from "next/server";

import { scrapeOngoingSeries } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";

export const GET = withAuth(async (req: NextRequest) => {
    try {
        const page = req.nextUrl.searchParams.get("page") ?? "1";

        const url = `${process.env.DRAKORKITA_URL}/all?page=${page}&status=returning%20series`;
        const html = proxyFetchHTML(url);

        const data = await scrapeOngoingSeries({ data: html } as any);

        return NextResponse.json({
            message: "success",
            page: parseInt(page),
            ...data,
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