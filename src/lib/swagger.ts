export const swaggerSpec = {
    openapi: "3.0.0",

    /* ===============================
       COMPONENTS
    =============================== */
    components: {
        /* ===============================
           SECURITY SCHEME
        =============================== */
        securitySchemes: {
            ApiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "x-api-key",
            },
        },

        /* ===============================
           SCHEMAS (FIXED FOR $ref)
        =============================== */
        schemas: {
            GenreItem: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        example: "Action",
                    },
                    endpoint: {
                        type: "string",
                        example: "action",
                    },
                },
            },

            EpisodeItem: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        example: "Episode 4 Subtitle Indonesia",
                    },
                    endpoint: {
                        type: "string",
                        example: "nnshbti-s3-p2-episode-4-sub-indo",
                    },
                },
            },
        },
    },

    /* ===============================
       GLOBAL SECURITY
    =============================== */
    security: [
        {
            ApiKeyAuth: [],
        },
    ],

    /* ===============================
       INFO
    =============================== */
    info: {
        title: "Drakor + Anime Scraping API",
        version: "1.0.0",
        description:
            "Dokumentasi API untuk scraping data drama/movie dari Drakorkita dan anime dari Situs Anime.",
    },

    /* ===============================
       SERVERS
    =============================== */
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Server Lokal (Development)",
        },
        // {
        //   url: "https://nyekrap-suru.vercel.app/api",
        //   description: "Server Production",
        // },
    ],

    /* ===============================
       TAGS
    =============================== */
    tags: [
        {
            name: "Drakorkita",
            description: "Endpoint scraping drama dan film dari Drakorkita",
        },
        {
            name: "Anime",
            description: "Endpoint scraping anime ongoing & complete dari Situs Anime",
        },
    ],

    /* ===============================
       PATHS
    =============================== */
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

        /* ===============================
           GENRES
        =============================== */
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
                    "Mengambil daftar resolusi video streaming berdasarkan episode ID.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                            example: "Ge5LwM681Dn",
                        },
                    },
                    {
                        name: "tag",
                        in: "query",
                        required: true,
                        schema: {
                            type: "string",
                            example: "708aab6f6553a34f80509a8f906eb0b7",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "Berhasil mengambil link resolusi video episode",
                    },
                },
            },
        },

        /* ===============================
           ANIME HOMEPAGE (Situs Anime)
        =============================== */
        "/anime/homepage": {
            get: {
                tags: ["Anime"],
                summary: "Ambil Homepage Anime (Ongoing + Complete)",
                description:
                    "Mengambil daftar anime ongoing terbaru dan anime complete dari Situs Anime.",
                responses: {
                    200: {
                        description: "Berhasil mengambil data anime",
                    },
                    500: {
                        description: "Server error saat scraping Situs Anime",
                    },
                },
            },
        },

        /* ===============================
           ANIME LIST (Situs Anime)
        =============================== */
        "/anime/list-anime": {
            get: {
                tags: ["Anime"],
                summary: "Ambil Daftar Anime (semua)",
                description:
                    "Mengambil daftar list anime dari Situs Anime.",
                responses: {
                    200: {
                        description: "Berhasil mengambil data anime",
                    },
                    500: {
                        description: "Server error saat scraping Situs Anime",
                    },
                },
            },
        },

        /* ===============================
           ANIME DETAIL (FIXED $ref)
        =============================== */
        "/anime/detail/{slug}": {
            get: {
                tags: ["Anime"],
                summary: "Get Anime Detail",
                description:
                    "Scrape Situs Anime anime detail page with Redis cache",
                parameters: [
                    {
                        name: "slug",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                        example: "enen-shouboutai-season-3-p2-sub-indo",
                    },
                ],
                responses: {
                    200: {
                        description: "Anime detail scraped successfully",
                    },
                    500: {
                        description: "Internal Server Error",
                    },
                },
            },
        },

        /* ===============================
           ANIME Streaming
        =============================== */
        "/anime/streaming/{slug}": {
            get: {
                tags: ["Anime"],
                summary: "Get Episode Streaming + Download Links",
                description:
                    "Scrape Situs Anime episode page untuk mendapatkan iframe streaming, mirror provider, dan link download.",

                parameters: [
                    {
                        name: "slug",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                        example: "nnshbti-s3-p2-episode-1-sub-indo",
                    },
                ],

                responses: {
                    200: {
                        description: "Episode data scraped successfully",
                    },
                    500: {
                        description: "Internal Server Error",
                    },
                },
            },
        },

        /* ===============================
           ANIME Genre
        =============================== */
        "/anime/genres": {
            get: {
                tags: ["Anime"],
                summary: "Get Anime Genre List",
                description:
                    "Mengambil semua genre anime dari Situs Anime berdasarkan halaman genre-list.",

                responses: {
                    200: {
                        description: "Genre list berhasil diambil",
                    },

                    500: {
                        description: "Internal Server Error",
                    },
                },
            },
        },

        /* ===============================
           ANIME Genre Detail
        =============================== */
        "/anime/genres/{genre}": {
            get: {
                tags: ["Anime"],
                summary: "Get Anime List by Genre",
                description:
                    "Mengambil daftar anime berdasarkan genre tertentu dari Situs Anime, mendukung pagination.",

                parameters: [
                    {
                        name: "genre",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                        example: "demons",
                    },
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: { type: "integer" },
                        example: 1,
                    },
                ],

                responses: {
                    200: {
                        description: "Genre anime list scraped successfully",
                    },
                    500: {
                        description: "Internal Server Error",
                    },
                },
            },
        },

        /* ===============================
            ANIME Search
         =============================== */
        "/anime/search": {
            get: {
                tags: ["Anime"],
                summary: "Search Anime Situs Anime",
                description:
                    "Mencari anime berdasarkan keyword dari Situs Anime (max 12 hasil).",

                parameters: [
                    {
                        name: "q",
                        in: "query",
                        required: true,
                        schema: { type: "string" },
                        example: "tes",
                    },
                ],

                responses: {
                    200: {
                        description: "Anime search result scraped successfully",
                    },
                    400: {
                        description: "Query parameter missing",
                    },
                },
            },
        },
    },
};