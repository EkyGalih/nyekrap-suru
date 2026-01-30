import { NextRequest, NextResponse } from "next/server"
import { proxyFetchHTML } from "@/src/lib/proxyFetch"
import { getCache, setCache } from "@/src/lib/redisCache"

export const runtime = "nodejs"

/**
 * GET EPISODE VIDEO RESOLUTIONS
 * Example:
 * /api/drakorkita/episode/Ge5LwM681Dn?tag=xxxx
 */

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    let cacheKey = "unknown"

    try {
        // ✅ params wajib await
        const { id } = await params

        if (!id) {
            return NextResponse.json(
                { message: "error", error: "Episode ID tidak valid" },
                { status: 400 }
            )
        }

        // ✅ API KEY CHECK
        const apiKey = req.headers.get("x-api-key")
        if (apiKey !== process.env.API_KEY) {
            return NextResponse.json(
                { message: "error", error: "Unauthorized" },
                { status: 401 }
            )
        }

        // ✅ tag wajib dari detail
        const tag = req.nextUrl.searchParams.get("tag")

        if (!tag) {
            return NextResponse.json(
                {
                    message: "error",
                    error: "Query param 'tag' wajib diisi (ambil dari detail episodes)",
                },
                { status: 400 }
            )
        }

        // ===============================
        // ✅ CACHE KEY
        // ===============================
        cacheKey = `drakorkita:episode:${id}:tag:${tag}`

        const cached = await getCache(cacheKey)

        if (cached) {
            console.log("⚡ EPISODE CACHE HIT:", cacheKey)

            return NextResponse.json({
                message: "success (cache)",
                ...cached,
            })
        }

        console.log("🔥 EPISODE CACHE MISS → SCRAPING:", cacheKey)

        // ===============================
        // 1) server.php
        // ===============================
        const serverUrl = `${process.env.DRAKORKITA_URL}/api/server.php?episode_id=${id}&tag=${encodeURIComponent(
            tag
        )}`

        const serverRaw = await proxyFetchHTML(serverUrl)
        const serverJson = JSON.parse(serverRaw)

        if (!serverJson?.data) {
            return NextResponse.json(
                {
                    message: "error",
                    error: "server.php return null → tag salah atau provider blocked",
                    episode_id: id,
                    tag,
                },
                { status: 502 }
            )
        }

        const { qua, server_id } = serverJson.data

        // ===============================
        // 2) video.php
        // ===============================
        const videoUrl = `${process.env.DRAKORKITA_URL}/api/video.php?id=${id}&qua=${encodeURIComponent(
            qua
        )}&server_id=${encodeURIComponent(server_id)}&tag=${encodeURIComponent(tag)}`

        const videoRaw = await proxyFetchHTML(videoUrl)
        const videoJson = JSON.parse(videoRaw)

        if (!videoJson?.file) {
            return NextResponse.json(
                {
                    message: "error",
                    error: "video.php tidak mengembalikan file",
                    episode_id: id,
                },
                { status: 502 }
            )
        }

        // ===============================
        // Parse Resolutions
        // ===============================
        const resolutions = videoJson.file.split(",").map((link: string) => {
            const match = link.match(/(\d{3,4})p/)

            return {
                resolution: match ? `${match[1]}p` : "Unknown",
                src: link.substring(link.indexOf("https")).trim(),
            }
        })

        const payload = {
            episode_id: id,
            tag,
            resolutions,
        }

        // ===============================
        // ✅ SAVE CACHE 12 JAM
        // ===============================
        await setCache(cacheKey, payload, 43200)

        console.log("✅ EPISODE SAVED:", cacheKey)

        return NextResponse.json({
            message: "success",
            ...payload,
        })
    } catch (err: unknown) {
        console.error("❌ EPISODE ERROR:", cacheKey)

        return NextResponse.json(
            {
                message: "error",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        )
    }
}