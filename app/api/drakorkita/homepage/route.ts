import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "@/src/lib/headers";
import { scrapeHomePage } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";

export const runtime = "nodejs";

export const GET = withAuth(async (_req: NextRequest) => {
  try {
    if (!process.env.DRAKORKITA_URL) {
      throw new Error("DRAKORKITA_URL belum diset di ENV");
    }

    const url = `${process.env.DRAKORKITA_URL}/`;

    console.log("FETCH HOMEPAGE:", url);

    const response = await axios.get<string>(url, {
      headers,
      timeout: 10000,
    });

    const result = await scrapeHomePage(response);

    return NextResponse.json({
      message: "success",
      data: result,
    });
  } catch (err: unknown) {
    console.error("HOMEPAGE ERROR:", err);

    // ✅ Debug khusus axios
    if (axios.isAxiosError(err)) {
      console.log("AXIOS STATUS:", err.response?.status);
      console.log("AXIOS DATA:", err.response?.data);
    }

    return NextResponse.json(
      {
        message: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});