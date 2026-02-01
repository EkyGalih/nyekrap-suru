import { AnimeGenreDetailResult, AnimeGenreItem, AnimeItem, AnimeListItem, AnimeSearchResult, DownloadItem, EpisodeItem, GenreAnimeItem, GenreItem, MirrorItem, OtakudesuAnimeListResult, OtakudesuDetailResult, OtakudesuEpisodeResult, OtakudesuHomeResult, SearchAnimeItem } from "@/app/types/anime/anime";
import { load } from "cheerio";

export function scrapeAnimeList(
    html: string
): OtakudesuAnimeListResult {
    const $ = load(html);

    const results: AnimeListItem[] = [];

    $(".penzbar a.hodebgst").each((_, el) => {
        const title = $(el).text().trim();
        const link = $(el).attr("href") ?? "";

        // endpoint slug
        const endpoint = link
            .replace(`${process.env.OTAKUDESU_URL}/anime/`, "")
            .replace("/", "")
            .trim();

        if (title && endpoint) {
            results.push({
                title,
                link,
                endpoint,
            });
        }
    });

    return {
        total: results.length,
        anime_list: results,
    };
}

export function scrapeOtakudesuHome(html: string): OtakudesuHomeResult {
    const $ = load(html);

    /* ===============================
       Helper Parse List
    =============================== */
    function parseSection(section: any): AnimeItem[] {
        const items: AnimeItem[] = [];

        section.find("ul > li").each((_: any, el: any) => {
            const anime = $(el);

            const title = anime.find("h2.jdlflm").text().trim();

            const episode = anime.find(".epz").text().trim();

            const info = anime.find(".epztipe").text().trim();

            const update = anime.find(".newnime").text().trim();

            const link = anime.find("a").attr("href") ?? "";

            const thumbnail =
                anime.find("img").attr("src") ??
                anime.find("img").attr("data-src") ??
                "";

            // endpoint slug
            const endpoint = link
                .replace(`${process.env.OTAKUDESU_URL}/anime/`, "")
                .replace("/", "")
                .trim();

            if (title && endpoint) {
                items.push({
                    title,
                    episode,
                    info,
                    update,
                    thumbnail,
                    link,
                    endpoint,
                });
            }
        });

        return items;
    }

    /* ===============================
       Sections:
       0 = Ongoing
       1 = Complete
    =============================== */

    const sections = $(".rseries");

    const ongoingSection = sections.eq(0).find(".venz");
    const completeSection = sections.eq(1).find(".venz");

    return {
        ongoing: parseSection(ongoingSection),
        complete: parseSection(completeSection),
    };
}

export function scrapeOtakudesuDetail(html: string): OtakudesuDetailResult {
    const $ = load(html);

    /* ===============================
       Title + Thumbnail
    =============================== */
    const title =
        $(".jdlrx h1").text().replace("Subtitle Indonesia", "").trim();

    const thumbnail =
        $(".fotoanime img").attr("src") ?? "";

    /* ===============================
       Info Table Parsing
    =============================== */
    const infoBox = $(".infozingle");

    function getInfo(label: string): string {
        return (
            infoBox
                .find(`p:contains("${label}")`)
                .text()
                .replace(label, "")
                .replace(":", "")
                .trim() || ""
        );
    }

    const japanese = getInfo("Japanese");
    const score = getInfo("Skor");
    const producer = getInfo("Produser");
    const type = getInfo("Tipe");
    const status = getInfo("Status");
    const total_episode = getInfo("Total Episode");
    const duration = getInfo("Durasi");
    const release_date = getInfo("Tanggal Rilis");
    const studio = getInfo("Studio");

    /* ===============================
       Genres
    =============================== */
    const genres: GenreItem[] = [];

    infoBox.find(`p:contains("Genre") a`).each((_, el) => {
        const genreTitle = $(el).text().trim();
        const link = $(el).attr("href") ?? "";

        const endpoint = link
            .replace("https://otakudesu.best/genres/", "")
            .replace("/", "")
            .trim();

        if (genreTitle && endpoint) {
            genres.push({
                title: genreTitle,
                endpoint,
            });
        }
    });

    /* ===============================
       Synopsis
    =============================== */
    const synopsis =
        $(".sinopc").text().trim() ||
        "Sinopsis belum tersedia.";

    /* ===============================
       Episode List
    =============================== */
    const episode_list: EpisodeItem[] = [];

    $(".episodelist ul li a").each((_, el) => {
        const epsTitle = $(el).text().trim();
        const link = $(el).attr("href") ?? "";

        const endpoint = link
            .replace("https://otakudesu.best/episode/", "")
            .replace("/", "")
            .trim();

        if (epsTitle && endpoint) {
            episode_list.push({
                title: epsTitle,
                endpoint,
            });
        }
    });

    /* ===============================
       First & Latest Episode
    =============================== */
    const first_eps = episode_list[episode_list.length - 1] ?? {
        title: "",
        endpoint: "",
    };

    const latest_eps = episode_list[0] ?? {
        title: "",
        endpoint: "",
    };

    /* ===============================
       Return Result
    =============================== */
    return {
        title,
        japanese,
        thumbnail,
        score,
        producer,
        type,
        status,
        total_episode,
        duration,
        release_date,
        studio,
        synopsis,
        genres,
        first_eps,
        latest_eps,
        episode_list,
    };
}

export function scrapeOtakudesuEpisode(
    html: string
): OtakudesuEpisodeResult {
    const $ = load(html);

    /* ===============================
       Title
    =============================== */
    const title = $("h1.posttl").text().trim();

    /* ===============================
       Streaming Iframe
    =============================== */
    const streaming_iframe =
        $(".player-embed iframe").attr("src") ?? "";

    /* ===============================
       Mirrors
       Format:
       <ul class="m480p">
          <li><a data-content="...">ondesu3</a></li>
       </ul>
    =============================== */
    const mirrors: MirrorItem[] = [];

    $(".mirrorstream ul").each((_, ul) => {
        const resolution = $(ul)
            .attr("class")
            ?.replace("m", "") ?? "";

        $(ul)
            .find("li a")
            .each((_, a) => {
                const provider = $(a).text().trim();
                const data = $(a).attr("data-content") ?? "";

                if (provider && data) {
                    mirrors.push({
                        resolution: resolution + "p",
                        provider,
                        data,
                    });
                }
            });
    });

    /* ===============================
       Download Links
       Format:
       <li><strong>Mp4 720p</strong>
          <a>ODFiles</a>
          <a>Mega</a>
          <i>109 MB</i>
       </li>
    =============================== */
    const downloads: DownloadItem[] = [];

    $(".download ul li").each((_, li) => {
        const quality = $(li).find("strong").text().trim();

        const size = $(li).find("i").text().trim();

        const links: any[] = [];

        $(li)
            .find("a")
            .each((_, a) => {
                const provider = $(a).text().trim();
                const url = $(a).attr("href") ?? "";

                if (provider && url) {
                    links.push({
                        provider,
                        url,
                    });
                }
            });

        if (quality && links.length > 0) {
            downloads.push({
                quality,
                size,
                links,
            });
        }
    });

    return {
        title,
        streaming_iframe,
        mirrors,
        downloads,
    };
}

export function scrapeAnimeGenres(html: string): AnimeGenreItem[] {
    const $ = load(html);

    const genres: AnimeGenreItem[] = [];

    /* ===============================
       Genre List Selector
       <ul class="genres">
          <a href="/genres/action/">Action</a>
    =============================== */
    $(".genres a").each((_, el) => {
        const title = $(el).text().trim();

        const link = $(el).attr("href") ?? "";

        // endpoint: /genres/action/
        const endpoint = link
            .replace("/genres/", "")
            .replace("/", "")
            .trim();

        // filter hentai & ecchi
        if (endpoint === "hentai" || endpoint === "ecchi") return;

        if (title && endpoint) {
            genres.push({
                title,
                endpoint,
            });
        }
    });

    return genres;
}

export function scrapeAnimeGenreDetail(
    html: string,
    genre: string,
    page: number
): AnimeGenreDetailResult {
    const $ = load(html);

    /* ===============================
       Anime List
    =============================== */
    const anime_list: GenreAnimeItem[] = [];

    $(".col-anime-con").each((_, el) => {
        const title =
            $(el).find(".col-anime-title a").text().trim();

        const link =
            $(el).find(".col-anime-title a").attr("href") ?? "";

        const endpoint = link
            .replace(`${process.env.OTAKUDESU_URL}/anime/`, "")
            .replace("/", "")
            .trim();

        const studio =
            $(el).find(".col-anime-studio").text().trim();

        const eps =
            $(el).find(".col-anime-eps").text().trim();

        const rating =
            $(el).find(".col-anime-rating").text().trim();

        const season =
            $(el).find(".col-anime-date").text().trim();

        const thumbnail =
            $(el).find(".col-anime-cover img").attr("src") ?? "";

        const genres: string[] = [];

        $(el)
            .find(".col-anime-genre a")
            .each((_, g) => {
                const genreTitle = $(g).text().trim();
                if (genreTitle) genres.push(genreTitle);
            });

        if (title && endpoint) {
            anime_list.push({
                title,
                endpoint,
                thumbnail,
                studio,
                eps,
                rating,
                season,
                genres,
            });
        }
    });

    /* ===============================
       Pagination Parse
    =============================== */
    let total_pages = 1;

    $(".pagenavix a.page-numbers").each((_, a) => {
        const num = parseInt($(a).text().trim());

        if (!isNaN(num) && num > total_pages) {
            total_pages = num;
        }
    });

    /* ===============================
       Pagination Meta
    =============================== */
    const has_next = page < total_pages;
    const has_prev = page > 1;

    return {
        genre,

        current_page: page,
        total_pages,

        has_next,
        has_prev,

        next_page: has_next ? page + 1 : null,
        prev_page: has_prev ? page - 1 : null,

        anime_list,
    };
}

export function scrapeAnimeSearch(
    html: string,
    query: string
): AnimeSearchResult {
    const $ = load(html);

    const anime_list: SearchAnimeItem[] = [];

    /* ===============================
       Search Result List
    =============================== */
    $("ul.chivsrc > li").each((_, el) => {
        const title = $(el).find("h2 a").text().trim();

        const link = $(el).find("h2 a").attr("href") ?? "";

        // endpoint: /anime/xxx-sub-indo/
        const endpoint = link
            .replace(`${process.env.OTAKUDESU_URL}/anime/`, "")
            .replace("/", "")
            .trim();

        const thumbnail = $(el).find("img").attr("src") ?? "";

        /* ===============================
           Genres
        =============================== */
        const genres: string[] = [];

        $(el)
            .find("div.set")
            .first()
            .find("a")
            .each((_, g) => {
                const genreTitle = $(g).text().trim();
                if (genreTitle) genres.push(genreTitle);
            });

        /* ===============================
           Status
        =============================== */
        const status = $(el)
            .find("div.set")
            .filter((_, div) => {
                return $(div).text().includes("Status");
            })
            .text()
            .replace("Status", "")
            .replace(":", "")
            .trim();

        /* ===============================
           Rating
        =============================== */
        const rating = $(el)
            .find("div.set")
            .filter((_, div) => {
                return $(div).text().includes("Rating");
            })
            .text()
            .replace("Rating", "")
            .replace(":", "")
            .trim();

        if (title && endpoint) {
            anime_list.push({
                title,
                endpoint,
                thumbnail,
                status: status || "Unknown",
                rating: rating || "-",
                genres,
            });
        }
    });

    return {
        query,
        total_results: anime_list.length,
        anime_list,
    };
}