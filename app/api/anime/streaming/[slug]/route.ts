import { NextResponse } from "next/server";

import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { redis } from "@/src/lib/redisCache";
import { scrapeOtakudesuEpisode } from "@/src/lib/scrapers/anime";
import { getErrorMessage } from "@/src/lib/getErrorMessage";

export const runtime = "nodejs";

export const GET = withAuth(
    async (
        _req,
        { params }: { params: Promise<{ slug: string }> }
    ) => {
        try {
            // ✅ WAJIB await params
            const { slug } = await params;

            if (!slug) {
                return NextResponse.json(
                    { message: "error", error: "Slug wajib ada" },
                    { status: 400 }
                );
            }

            const cacheKey = `anime:streaming:${slug}`;

            /* ===============================
               ✅ CACHE CHECK
            =============================== */
            const cached = await redis.get(cacheKey);

            if (cached) {
                return NextResponse.json({
                    message: "success (cache)",
                    data: cached,
                });
            }

            /* ===============================
               ✅ FETCH HTML
            =============================== */
            const url = `${process.env.OTAKUDESU_URL}/episode/${slug}/`;

            const html = await proxyFetchHTML(url);

            /* ===============================
               ✅ SCRAPE RESULT
            =============================== */
            const result = scrapeOtakudesuEpisode(html);

            // ❌ Jangan cache kalau kosong
            if (!result.streaming_iframe) {
                throw new Error("Scraper gagal ambil iframe (HTML berubah / diblok)");
            }

            /* ===============================
               ✅ SAVE CACHE (1 jam)
            =============================== */
            await redis.set(cacheKey, result, {
                ex: 3600,
            });

            return NextResponse.json({
                message: "success",
                data: result,
            });
        } catch (err: unknown) {
            return NextResponse.json(
                {
                    message: "error",
                    error: getErrorMessage(err),
                },
                { status: 500 }
            );
        }
    }
);