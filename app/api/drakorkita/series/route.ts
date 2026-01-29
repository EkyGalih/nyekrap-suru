import { NextRequest, NextResponse } from "next/server";
import { scrapeSeries } from "@/src/lib/scrapers/drakorkita";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const page = req.nextUrl.searchParams.get("page") || "1";

    const url = `${process.env.DRAKORKITA_URL}/all?media_type=tv&page=${page}`;
    const html = await proxyFetchHTML(url);

    const datas = await scrapeSeries({ data: html } as any);

    const totalPage = datas.pagination;
    const currentPage = parseInt(page);

    return NextResponse.json({
      message: "success",
      page: currentPage,
      pagination: totalPage,
      datas: datas.datas,
      pagination_info: {
        current_page: currentPage,
        total_page: totalPage,
        has_next: currentPage < totalPage,
        has_prev: currentPage > 1,
        next_page: currentPage < totalPage ? currentPage + 1 : null,
        prev_page: currentPage > 1 ? currentPage - 1 : null,
      },
    },
      {
        headers: {
          "Cache-Control": "s-maxage=600, stale-while-revalidate=120",
        },
      }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "error", error: getErrorMessage(error) },
      { status: 500 }
    );
  }
});