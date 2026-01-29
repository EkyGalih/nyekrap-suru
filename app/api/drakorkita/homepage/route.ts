import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { headers } from "@/src/lib/headers";
import { scrapeHomePage } from "@/src/lib/scrapers/drakorkita";
import { withAuth } from "@/src/lib/withAuth";

export const GET = withAuth(async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") ?? "1";

  const response = await axios.get<string>(
    `${process.env.DRAKORKITA_URL}/page/${page}`,
    { headers }
  );

  const result = await scrapeHomePage(response);

  return NextResponse.json({
    message: "success",
    page: Number(page),
    data: result,
  });
});