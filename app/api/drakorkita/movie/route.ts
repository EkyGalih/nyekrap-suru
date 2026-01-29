import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "@/src/lib/headers";
import { scrapeMovie } from "@/src/lib/scrapers/drakorkita";

export async function GET(req: NextRequest) {
    try {
        const page = req.nextUrl.searchParams.get("page") || "1";

        const axiosRequest = await axios.get<string>(
            `${process.env.DRAKORKITA_URL}/all?media_type=movie&page=${page}`,
            { headers }
        );

        const result = await scrapeMovie(axiosRequest);

        return NextResponse.json({
            message: "success",
            page: parseInt(page),
            pagination: result.pagination,
            datas: result.datas,
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            { message: "error", error: message },
            { status: 500 }
        );
    }
}