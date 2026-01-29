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

    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          message: "axios error",
          status: err.response?.status,
          target_url: err.config?.url,
          headers_sent: err.config?.headers,
          response_preview:
            typeof err.response?.data === "string"
              ? err.response.data.slice(0, 300)
              : err.response?.data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "unknown error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});