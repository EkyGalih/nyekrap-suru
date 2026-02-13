import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeDetailAllType } from "@/src/lib/scrapers/drakorkita";
import { getCache, setCache } from "@/src/lib/redisCache";
import { fetchHTMLAnime } from "@/src/lib/fetchHtmlAnime";

export const runtime = "nodejs";

export const GET = withAuth(
    async (
        _req: NextRequest,
        { params }: { params: Promise<{ endpoint: string }> }
    ) => {
        let cacheKey = "unknown";

        try {
            const { endpoint } = await params;

            if (!endpoint) {
                return NextResponse.json(
                    { message: "Endpoint tidak valid" },
                    { status: 400 }
                );
            }

            cacheKey = `drakorkita:detail:${endpoint}`;

            /* ===============================
               1. CACHE CHECK
            =============================== */
            const cached = await getCache(cacheKey);

            if (cached) {
                console.log(`⚡ DETAIL CACHE HIT: ${cacheKey}`);

                return NextResponse.json({
                    message: "success (cache)",
                    data: cached,
                });
            }

            console.log(`🔥 DETAIL CACHE MISS → SCRAPING: ${cacheKey}`);

            /* ===============================
               2. FETCH HTML VIA PROXY
            =============================== */
            const url = `${process.env.DRAKORKITA_URL}/detail/${endpoint}`;
            const html = await fetchHTMLAnime(url);

            if (!html || html.length < 500) {
                throw new Error("HTML kosong / gagal fetch detail page");
            }

            /* ===============================
               3. SCRAPE DETAIL
            =============================== */
            const data = await scrapeDetailAllType(endpoint, html);

            if (!data || (data as any).error) {
                throw new Error("Scrape detail gagal atau data invalid");
            }

            /* ===============================
               4. SAVE CACHE (7 HARI)
            =============================== */
            await setCache(cacheKey, data, 604800);

            console.log(`✅ DETAIL SAVED: ${cacheKey}`);

            return NextResponse.json({
                message: "success",
                data,
            });
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error";

            console.error(`❌ DETAIL ERROR [${cacheKey}]:`, errorMessage);

            return NextResponse.json(
                {
                    message: "error",
                    error: errorMessage,
                },
                { status: 500 }
            );
        }
    }
);