import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "@/src/lib/headers";
import { scrapeSeries } from "@/src/lib/scrapers/drakorkita";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { withAuth } from "@/src/lib/withAuth";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const page = req.nextUrl.searchParams.get("page") || "1";

    const axiosRequest = await axios.get(
      `${process.env.DRAKORKITA_URL}/all?media_type=tv&page=${page}`,
      { headers }
    );

    const datas = await scrapeSeries(axiosRequest);

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
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "error", error: getErrorMessage(error) },
      { status: 500 }
    );
  }
});