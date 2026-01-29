import { NextResponse } from "next/server";
import { withAuth } from "@/src/lib/withAuth";

import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeHomePage } from "@/src/lib/scrapers/drakorkita";

export const runtime = "nodejs";

export const GET = withAuth(async () => {
  try {
    const targetUrl = `${process.env.DRAKORKITA_URL}/`;

    // ✅ ambil html lewat proxy fallback
    const html = await proxyFetchHTML(targetUrl);

    // ✅ scrape langsung dari HTML string
    const result = await scrapeHomePage({
      data: html,
    } as any);

    return NextResponse.json({
      message: "success",
      data: result,
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
});