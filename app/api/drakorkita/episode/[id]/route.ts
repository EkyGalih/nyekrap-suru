import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/src/lib/withAuth";
import { proxyFetchHTML } from "@/src/lib/proxyFetch";

import { getCache, setCache } from "@/src/lib/redisCache";

export const runtime = "nodejs";

type ServerResponse =
    | { data: { qua: string; server_id: string } }
    | { data: null;[key: string]: unknown };

type VideoResponse =
    | { file: string }
    | { file?: string;[key: string]: unknown };

export const GET = withAuth(
    async (
        req: NextRequest,
        { params }: { params: Promise<{ id: string }> }
    ) => {
        const { id } = await params;

        try {
            if (!id) {
                return NextResponse.json(
                    { message: "error", error: "Episode ID tidak valid" },
                    { status: 400 }
                );
            }

            // ✅ tag dari client
            const tag = req.nextUrl.searchParams.get("tag");

            if (!tag) {
                return NextResponse.json(
                    { message: "error", error: "Query param 'tag' wajib diisi" },
                    { status: 400 }
                );
            }

            // ===============================
            // ✅ REDIS CACHE KEY
            // ===============================
            const cacheKey = `drakorkita:episode:${id}:tag:${tag}`;

            const cached = await getCache(cacheKey);

            if (cached) {
                console.log("⚡ EPISODE CACHE HIT:", cacheKey);

                return NextResponse.json({
                    message: "success (cache)",
                    ...cached,
                });
            }

            console.log("🔥 EPISODE CACHE MISS → SCRAPING:", cacheKey);

            // ===============================
            // 1) server.php
            // ===============================
            const serverUrl = `${process.env.DRAKORKITA_URL}/api/server.php?episode_id=${id}&tag=${encodeURIComponent(
                tag
            )}`;

            const serverRaw = await proxyFetchHTML(serverUrl);

            let serverJson: ServerResponse;
            try {
                serverJson = JSON.parse(serverRaw) as ServerResponse;
            } catch {
                return NextResponse.json(
                    {
                        message: "error",
                        error: "server.php tidak mengembalikan JSON",
                        preview: serverRaw.slice(0, 200),
                    },
                    { status: 502 }
                );
            }

            if (!serverJson.data) {
                return NextResponse.json(
                    {
                        message: "error",
                        error: "server.php return data null → tag salah atau diblok",
                        episode_id: id,
                        tag,
                    },
                    { status: 502 }
                );
            }

            const { qua, server_id } = serverJson.data;

            // ===============================
            // 2) video.php
            // ===============================
            const videoUrl = `${process.env.DRAKORKITA_URL}/api/video.php?id=${id}&qua=${encodeURIComponent(
                qua
            )}&server_id=${encodeURIComponent(server_id)}&tag=${encodeURIComponent(
                tag
            )}`;

            const videoRaw = await proxyFetchHTML(videoUrl);

            let videoJson: VideoResponse;
            try {
                videoJson = JSON.parse(videoRaw) as VideoResponse;
            } catch {
                return NextResponse.json(
                    {
                        message: "error",
                        error: "video.php tidak mengembalikan JSON",
                        preview: videoRaw.slice(0, 200),
                    },
                    { status: 502 }
                );
            }

            if (!videoJson.file) {
                return NextResponse.json(
                    {
                        message: "error",
                        error: "video.php tidak punya field 'file'",
                        episode_id: id,
                    },
                    { status: 502 }
                );
            }

            // ===============================
            // Parse Resolutions
            // ===============================
            const resolutions = videoJson.file.split(",").map((link: string) => {
                const match = link.match(/(\d{3,4})p/);

                return {
                    resolution: match ? `${match[1]}p` : "Unknown",
                    src: link.substring(link.indexOf("https")).trim(),
                };
            });

            const payload = {
                episode_id: id,
                tag,
                resolutions,
            };

            // ===============================
            // ✅ SAVE CACHE 12 JAM
            // ===============================
            await setCache(cacheKey, payload, 43200);

            console.log("✅ EPISODE SAVED:", cacheKey);

            return NextResponse.json({
                message: "success",
                ...payload,
            });
        } catch (err: unknown) {
            return NextResponse.json(
                {
                    message: "error",
                    error: err instanceof Error ? err.message : "Unknown error",
                },
                { status: 500 }
            );
        }
    }
);