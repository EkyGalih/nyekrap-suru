import axios from "axios";
import { NextResponse } from "next/server";
import { scrapeDetailAllType } from "@/src/lib/scrapers/drakorkita";
import { headers } from "@/src/lib/headers";

export async function GET(
    req: Request,
    context: { params: Promise<{ endpoint: string }> }
) {
    try {
        // ✅ params sekarang harus di-await
        const { endpoint } = await context.params;

        const axiosRequest = await axios.get<string>(
            `${process.env.DRAKORKITA_URL}/detail/${endpoint}`,
            { headers }
        );

        const data = await scrapeDetailAllType(
            { endpoint },
            axiosRequest
        );

        return NextResponse.json({
            message: "success",
            data,
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