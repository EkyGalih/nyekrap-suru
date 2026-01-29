import { NextResponse } from "next/server";

/**
 * Helper response JSON dengan cache bawaan Vercel CDN
 *
 * @param data - isi response JSON
 * @param seconds - cache dalam detik (default 300s)
 */
export function jsonCache(data: unknown, seconds: number = 300) {
    return NextResponse.json(data, {
        headers: {
            /**
             * s-maxage = cache di CDN (Vercel Edge)
             * stale-while-revalidate = tetap kirim cache lama sambil update
             */
            "Cache-Control": `s-maxage=${seconds}, stale-while-revalidate=60`,
        },
    });
}