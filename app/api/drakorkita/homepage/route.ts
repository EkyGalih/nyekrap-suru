import { NextRequest, NextResponse } from "next/server";
import { load } from "cheerio";

import { withAuth } from "@/src/lib/withAuth";
import { zenrowsFetch } from "@/src/lib/zenrowsFetch";
import { scrapeHomePage } from "@/src/lib/scrapers/drakorkita";

export const runtime = "nodejs";

export const GET = withAuth(async (_req: NextRequest) => {
  try {
    const targetUrl = `${process.env.DRAKORKITA_URL}/`;

    console.log("SCRAPE VIA ZENROWS:", targetUrl);

    // ✅ Fetch HTML lewat ZenRows proxy
    const html = await zenrowsFetch(targetUrl);

    // Fake AxiosResponse supaya scraper kamu tetap bisa dipakai
    const result = await scrapeHomePage({
      data: html,
    } as any);

    return NextResponse.json({
      message: "success",
      data: result,
    });
  } catch (err: unknown) {
    console.error("ZENROWS HOMEPAGE ERROR:", err);

    return NextResponse.json(
      {
        message: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});