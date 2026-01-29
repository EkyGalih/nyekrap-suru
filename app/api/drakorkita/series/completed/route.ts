import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "@/src/lib/headers";
import { scrapeCompletedSeries } from "@/src/lib/scrapers/drakorkita";

export async function GET(req: NextRequest) {
    try {
        const page = req.nextUrl.searchParams.get("page") ?? "1";

        const response = await axios.get<string>(
            `${process.env.DRAKORKITA_URL}/all?page=${page}&status=ended`,
            { headers }
        );

        const data = await scrapeCompletedSeries(response);

        return NextResponse.json({
            message: "success",
            page: Number(page),
            ...data,
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