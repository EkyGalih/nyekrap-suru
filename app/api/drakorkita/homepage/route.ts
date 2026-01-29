import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeHomePage } from "@/src/lib/scrapers/drakorkita";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { jsonCache } from "@/src/lib/jsonCache";

export const runtime = "nodejs";

export const GET = withAuth(async () => {
  try {
    // ===============================
    // Target Homepage URL
    // ===============================
    const targetUrl = `${process.env.DRAKORKITA_URL}/`;

    // ===============================
    // Fetch HTML via Proxy Fallback
    // ===============================
    const html = await proxyFetchHTML(targetUrl);

    // ===============================
    // Scrape Homepage (HTML string)
    // ===============================
    const result = scrapeHomePage(html);

    // ===============================
    // Return Cached JSON
    // ===============================
    return jsonCache(
      {
        message: "success",
        data: result,
      },
      300 // cache 5 menit
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        message: "error",
        error: getErrorMessage(err),
      },
      { status: 500 }
    );
  }
});