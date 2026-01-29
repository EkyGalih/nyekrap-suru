import axios from "axios";
import { NextResponse } from "next/server";

import { headers } from "@/src/lib/headers";
import { scrapeGenres } from "@/src/lib/scrapers/drakorkita";

export async function GET() {
    try {
        const response = await axios.get<string>(
            `${process.env.DRAKORKITA_URL}/all`,
            { headers }
        );

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
}