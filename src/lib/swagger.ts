export const swaggerSpec = {
    openapi: "3.0.0",
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "x-api-key",
            },
        },
    },

    security: [
        {
            ApiKeyAuth: [],
        },
    ],

    info: {
        title: "Drakor Scraping API",
        version: "1.0.0",
        description:
            "Dokumentasi API untuk scraping data drama dan film dari situs Drakorkita.",
    },

    servers: [
        {
            // url: "http://localhost:3000/api",
            url: "https://nyekrap-suru.vercel.app/api",
            description: "Server Lokal (Development)",
        },
    ],

    tags: [
        {
            name: "Drakorkita",
            description: "Endpoint scraping drama dan film dari Drakorkita",
        },
    ],

    paths: {
        /* ===============================
           HOMEPAGE
        =============================== */
        "/drakorkita/homepage": {
            get: {
                tags: ["Drakorkita"],
                summary: "Ambil Drama Terbaru (Homepage)",
                description:
                    "Mengambil daftar drama terbaru yang tampil di halaman utama Drakorkita.",

                parameters: [
                ],

                responses: {
                    200: {
                        description: "Berhasil mengambil data homepage",
                    },
                },
            },
        },

        /* ===============================
           ALL SERIES
        =============================== */
        "/drakorkita/series": {
            get: {
                tags: ["Drakorkita"],
                summary: "Ambil Semua Series",
                description:
                    "Mengambil semua drama series (TV) dari Drakorkita berdasarkan halaman.",

                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        description: "Nomor halaman",
                        schema: {
                            type: "integer",
                            example: 1,
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Berhasil mengambil daftar series",
                    },
                },
            },
        },

        /* ===============================
           ONGOING SERIES
        =============================== */
        "/drakorkita/series/ongoing": {
            get: {
                tags: ["Drakorkita"],
                summary: "Ambil Series Ongoing",
                description:
                    "Mengambil daftar drama series yang masih ongoing (belum tamat).",

                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        description: "Nomor halaman",
                        schema: {
                            type: "integer",
                            example: 1,
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Berhasil mengambil series ongoing",
                    },
                },
            },
        },

        /* ===============================
           COMPLETED SERIES
        =============================== */
        "/drakorkita/series/completed": {
            get: {
                tags: ["Drakorkita"],
                summary: "Ambil Series Tamat (Completed/Ended)",
                description:
                    "Mengambil daftar drama series yang sudah selesai/tamat dari Drakorkita.",

                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        description: "Nomor halaman pagination",
                        schema: {
                            type: "integer",
                            example: 1,
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Berhasil mengambil daftar series completed",
                    },
                },
            },
        },

        /* ===============================
           MOVIE LIST
        =============================== */
        "/drakorkita/movie": {
            get: {
                tags: ["Drakorkita"],
                summary: "Ambil Semua Movie",
                description: "Mengambil daftar film/movie dari Drakorkita.",

                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        description: "Nomor halaman",
                        schema: {
                            type: "integer",
                            example: 1,
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Berhasil mengambil daftar movie",
                    },
                },
            },
        },

        /* ===============================
           SEARCH
        =============================== */
        "/drakorkita/search": {
            get: {
                tags: ["Drakorkita"],
                summary: "Cari Drama atau Movie",
                description:
                    "Melakukan pencarian drama/movie berdasarkan keyword yang dimasukkan.",

                parameters: [
                    {
                        name: "q",
                        in: "query",
                        required: true,
                        description: "Kata kunci pencarian (wajib)",
                        schema: {
                            type: "string",
                            example: "revenge",
                        },
                    },
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        description: "Nomor halaman pagination",
                        schema: {
                            type: "integer",
                            example: 1,
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Berhasil mengambil hasil pencarian",
                    },
                    400: {
                        description: "Keyword wajib diisi",
                    },
                },
            },
        },

        "/drakorkita/genres": {
            get: {
                tags: ["Drakorkita"],
                summary: "Ambil Semua Genre",
                description: "Mengambil daftar genre drama/movie dari Drakorkita.",
                responses: {
                    200: {
                        description: "Berhasil mengambil daftar genre",
                    },
                },
            },
        },

        "/drakorkita/genres/{endpoint}": {
            get: {
                tags: ["Drakorkita"],
                summary: "Ambil Drama Berdasarkan Genre",
                description:
                    "Mengambil daftar drama/movie berdasarkan genre tertentu.",
                parameters: [
                    {
                        name: "endpoint",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            example: "history",
                        },
                    },
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer",
                            example: 1,
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "Berhasil mengambil data berdasarkan genre",
                    },
                },
            },
        },

        /* ===============================
           DETAIL DRAMA
        =============================== */
        "/drakorkita/detail/{endpoint}": {
            get: {
                tags: ["Drakorkita"],
                summary: "Ambil Detail Drama atau Movie",
                description:
                    "Mengambil detail lengkap drama/movie berdasarkan endpoint detail.",

                parameters: [
                    {
                        name: "endpoint",
                        in: "path",
                        required: true,
                        description: "Slug endpoint drama/movie",
                        schema: {
                            type: "string",
                            example: "alchemy-of-souls-2022-x9ab",
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Berhasil mengambil detail drama/movie",
                    },
                },
            },
        },

        /* ===============================
   EPISODE STREAM RESOLUTION
=============================== */
        "/drakorkita/episode/{id}": {
            get: {
                tags: ["Drakorkita"],
                summary: "Ambil Link Video Episode (Lazy Load)",
                description:
                    "Mengambil daftar resolusi video streaming berdasarkan episode ID. Endpoint ini di-load hanya ketika user klik episode (lazy request) dan sudah menggunakan Redis cache agar tidak banjir request.",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "Episode ID dari hasil detail drama",
                        schema: {
                            type: "string",
                            example: "idol-i-2025-iyu4",
                        },
                    },

                    // ✅ optional tag (tidak wajib)
                    {
                        name: "tag",
                        in: "query",
                        required: true,
                        description:
                            "Gunakan tag episode yang sudah diambil dari detail episode.",
                        schema: {
                            type: "string",
                            example: "708aab6f6553a34f80509a8f906eb0b7",
                        },
                    },
                ],

                responses: {
                    200: {
                        description: "Berhasil mengambil link resolusi video episode",
                        content: {
                            "application/json": {
                                example: {
                                    message: "success",
                                    episode_id: "123456",
                                    resolutions: [
                                        {
                                            resolution: "1080p",
                                            src: "https://stream-provider.com/video1080.m3u8",
                                        },
                                        {
                                            resolution: "720p",
                                            src: "https://stream-provider.com/video720.m3u8",
                                        },
                                        {
                                            resolution: "480p",
                                            src: "https://stream-provider.com/video480.m3u8",
                                        },
                                    ],
                                },
                            },
                        },
                    },

                    400: {
                        description: "Episode ID tidak valid",
                    },

                    502: {
                        description: "Provider tidak mengembalikan data video",
                    },

                    500: {
                        description: "Server error",
                    },
                },
            },
        },
    },
};