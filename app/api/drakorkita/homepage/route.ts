import axios from "axios";
import { NextResponse } from "next/server";
import { headers } from "@/src/lib/headers";
import { scrapeHomePage } from "@/src/lib/scrapers/drakorkita";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const res = await axios.get<string>(process.env.DRAKORKITA_URL!, {
            headers,
        });

        const data = await scrapeHomePage(res);

        return NextResponse.json({
            message: "success",
            data,
        });
    } catch (err: unknown) {
        return NextResponse.json(
            { message: "error", error: String(err) },
            { status: 500 }
        );
    }
}