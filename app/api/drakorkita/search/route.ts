import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";
import { scrapeSearch } from "@/src/lib/scrapers/drakorkita";
import { redis } from "@/src/lib/redisCache";
import { getErrorMessage } from "@/src/lib/getErrorMessage";

export const runtime = "nodejs";

export const GET = withAuth(async (req: NextRequest) => {
    try {
        const keywordRaw = req.nextUrl.searchParams.get("q") ?? "";
        if (!keywordRaw.trim()) {
            return NextResponse.json({ message: "Keyword wajib diisi" }, { status: 400 });
        }

        const keyword = keywordRaw.trim();
        const page = req.nextUrl.searchParams.get("page") ?? "1";
        const currentPage = Number(page);

        // ✅ Normalisasi key agar lebih aman
        const safeKey = keyword.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
        const cacheKey = `drakorkita:search:${safeKey}:page:${page}`;

        // 1. ✅ Cek Cache Terlebih Dahulu
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log("⚡ CACHE HIT:", cacheKey);
            return NextResponse.json({
                message: "success (cache)",
                ...(typeof cached === "string" ? JSON.parse(cached) : cached),
            });
        }

        console.log("🔥 CACHE MISS → SCRAPING:", cacheKey);

        // 2. ✅ Target URL
        const targetUrl = `${process.env.DRAKORKITA_URL}/all?q=${encodeURIComponent(keyword)}&page=${page}`;

        // 3. ✅ Fetch HTML (Pastikan timeout di proxyFetchHTML tidak terlalu pendek)
        const html = await proxyFetchHTML(targetUrl);

        if (!html) {
            throw new Error("Gagal mendapatkan konten dari provider");
        }

        // 4. ✅ Scrape Result
        const result = scrapeSearch(html);

        // 5. ✅ Payload Construction
        const payload = {
            keyword,
            page: currentPage,
            pagination: result.pagination || 1,
            total: result.datas?.length || 0,
            datas: result.datas || [],
            pagination_info: {
                current_page: currentPage,
                total_page: result.pagination || 1,
                has_next: currentPage < (result.pagination || 1),
                has_prev: currentPage > 1,
                next_page: currentPage < (result.pagination || 1) ? currentPage + 1 : null,
                prev_page: currentPage > 1 ? currentPage - 1 : null,
            },
        };

        // 6. ✅ Save Cache secara Async (Jangan ditunggu/await jika ingin respon lebih cepat)
        // Set ke 1 jam (3600s) karena scraping sangat mahal/lama
        redis.set(cacheKey, JSON.stringify(payload), { ex: 3600 }).catch(err => console.error("Redis Set Error:", err));

        return NextResponse.json({
            message: "success",
            ...payload,
        });

    } catch (err: unknown) {
        console.error("❌ SEARCH ERROR:", err);
        return NextResponse.json(
            { message: "error", error: getErrorMessage(err) },
            { status: 500 }
        );
    }
});