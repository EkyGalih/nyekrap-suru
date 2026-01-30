import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeDetailAllType } from "@/src/lib/scrapers/drakorkita";
import { getCache, setCache } from "@/src/lib/redisCache";

export const runtime = "nodejs";

/**
 * GET DETAIL DRAMA/MOVIE
 * URL: /api/drakorkita/detail/[endpoint]
 */
export const GET = withAuth(
    async (_req: NextRequest, { params }: { params: Promise<{ endpoint: string }> }) => {
        try {
            const { endpoint } = await params;

            if (!endpoint) {
                return NextResponse.json({ message: "Endpoint tidak valid" }, { status: 400 });
            }

            const cacheKey = `drakorkita:detail:${endpoint}`;

            /* ===============================
               1. CEK CACHE REDIS
            =============================== */
            const cached = await getCache(cacheKey);

            if (cached) {
                console.log(`⚡ DETAIL CACHE HIT: ${cacheKey}`);
                return NextResponse.json({
                    message: "success (cache)",
                    data: typeof cached === "string" ? JSON.parse(cached) : cached,
                });
            }

            console.log(`🔥 DETAIL CACHE MISS → SCRAPING: ${cacheKey}`);

            /* ===============================
               2. FETCH HTML VIA PROXY
            =============================== */
            const url = `${process.env.DRAKORKITA_URL}/detail/${endpoint}`;
            const html = await proxyFetchHTML(url);

            // Validasi jika HTML kosong atau gagal fetch
            if (!html || html.length < 500) { // Asumsi detail page minimal > 500 karakter
                throw new Error("Gagal mengambil konten dari provider (HTML Empty)");
            }

            /* ===============================
               3. SCRAPE DETAIL
            =============================== */
            const data = await scrapeDetailAllType(endpoint, html);

            // Validasi hasil scrape agar tidak menyimpan data 'zonk'
            if (!data || Object.keys(data).length === 0) {
                throw new Error("Gagal mengekstrak data detail (Scrape Failed)");
            }

            /* ===============================
               4. SIMPAN KE CACHE (TTL 1 JAM)
            =============================== */
            // Gunakan await atau tidak tergantung apakah Anda ingin respon instan
            await setCache(cacheKey, data, 3600);

            console.log(`✅ DETAIL SAVED TO CACHE: ${cacheKey}`);

            return NextResponse.json({
                message: "success",
                data,
            });

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            console.error(`❌ DETAIL ERROR [${cacheKey ?? 'unknown'}]:`, errorMessage);

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