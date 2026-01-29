import { load } from "cheerio";
import axios, { AxiosResponse } from "axios";
import { CompletedSeriesCard, CompletedSeriesResult, DetailParams, DrakorDetailInfo, DrakorDetailResult, DrakorSeries, DrakorStar, EpisodeItem, EpisodeResolution, FilterOption, GenreDetailCard, GenreDetailResult, GenreItem, HomeResult, LatestItem, MovieItem, MovieResult, OngoingSeriesResult, SearchItem, SearchResult, SeriesCard, SeriesResult, SidebarItem } from "@/app/types/drakor/drama";
import { extractEndpoint, extractYear } from "../helpers/helpers";

export async function scrapeHomePage(
    res: AxiosResponse<string>
): Promise<HomeResult> {
    const $ = load(res.data);

    /* ===============================
       Helper untuk scrap section row
    =============================== */

    const scrapeSection = (rowIndex: number): LatestItem[] => {
        const items: LatestItem[] = [];

        // Ambil row berdasarkan urutan setelah heading
        const sectionRow = $("h4.heading1, h4.heading2")
            .eq(rowIndex)
            .next("div.row");

        sectionRow.find("div.card").each((_, card) => {
            const anchor = $(card).find("a.poster");

            const href = anchor.attr("href") ?? "";
            const endpoint = extractEndpoint(href);

            // Title raw
            const titleRaw =
                anchor
                    .find("span.titit")
                    .clone()
                    .children()
                    .remove()
                    .end()
                    .text()
                    .trim() ?? "";

            const year = extractYear(titleRaw);

            // Thumbnail
            const thumbnail = anchor.find("img.poster").attr("src") ?? null;

            // Resolution (span titit span pertama)
            const resolution =
                anchor.find("span.titit span").first().text().trim() || null;

            // Updated at (span titit span terakhir, jika ada)
            const updatedAt =
                anchor.find("span.titit span").last().text().trim() || null;

            // Episode info
            const eps = anchor.find("span.rate").text().trim() || null;

            // Duration / type
            const duration = anchor.find("span.type").text().trim() || null;

            // Rating
            const ratingText = anchor.find("span.rat").text().trim();
            const rating = ratingText
                ? ratingText.replace("★", "").replace(/\s+/g, " ").trim()
                : null;

            if (endpoint) {
                items.push({
                    title: titleRaw,
                    year,
                    endpoint,
                    thumbnail,

                    eps,
                    duration,
                    resolution,
                    updated_at: updatedAt,
                    rating,
                });
            }
        });

        return items;
    };

    /* ===============================
       SECTION INDEX MAPPING
       Homepage urutannya:
       0 = Eps Terbaru
       1 = Movie Terbaru
       2 = Serie Terbaru
    =============================== */

    const latest_eps = scrapeSection(0);
    const latest_movies = scrapeSection(1);
    const latest_series = scrapeSection(2);

    return {
        latest_eps,
        latest_movies,
        latest_series,
    };
}

export async function scrapeSeries(
    res: AxiosResponse<string>
): Promise<SeriesResult> {
    const $ = load(res.data);

    const datas: DrakorSeries[] = [];
    const pages: number[] = [];

    $("div.row.item-list")
        .find("div.card")
        .each((_, el) => {
            const rawTitle =
                $(el).find("span.titit").html()?.split("<br>")[0]?.trim() ?? "";

            const yearMatch = rawTitle.match(/\((\d{4})\)/);
            const year = yearMatch ? yearMatch[1] : null;

            datas.push({
                title: rawTitle,
                year,
                time: $(el).find("span.type").first().text().trim(),
                eps: $(el).find("span.tagw span.qua").text().trim(),
                rating:
                    $(el).find("span.rat").text().replace("★", "").trim() || null,
                resolution: $(el).find("span.titit span").first().text().trim(),
                updated_at: $(el).find("span.titit span").last().text().trim(),
                thumbnail: $(el).find("img.poster").attr("src"),
                endpoint:
                    $(el)
                        .find("a")
                        .attr("href")
                        ?.replace("/detail/", "")
                        .replace("/", "") ?? null,
            });
        });

    $(".wp-pagenavi a, .wp-pagenavi span").each((_, el) => {
        const num = parseInt($(el).text().trim());
        if (!isNaN(num)) pages.push(num);
    });

    return {
        pagination: pages.length ? Math.max(...pages) : 1,
        datas,
    };
}

export async function scrapeOngoingSeries(
    res: AxiosResponse<string>
): Promise<OngoingSeriesResult> {
    const $ = load(res.data);

    const datas: SeriesCard[] = [];
    const pages: number[] = [];

    /* ===============================
       MAIN LIST CARD
    =============================== */

    $(".row.item-list .card").each((_, el) => {
        const anchor = $(el).find("a.poster");

        const href = anchor.attr("href") ?? "";
        const endpoint = extractEndpoint(href);

        // Title
        const title =
            anchor
                .find("span.titit")
                .clone()
                .children()
                .remove()
                .end()
                .text()
                .trim() ?? "";

        // Duration
        const duration = anchor.find("span.type").text().trim() || null;

        // Resolution
        const resolution =
            anchor.find("span.titit span").first().text().trim() || null;

        // Updated At
        const updated_at =
            anchor.find("span.titit span").last().text().trim() || null;

        // Episode
        const eps =
            anchor.find("span.tagw span.qua").text().trim() || null;

        // Rating
        const ratingText = anchor.find("span.rat").text().trim();
        const rating = ratingText
            ? ratingText.replace("★", "").replace(/\s+/g, " ").trim()
            : null;

        // Thumbnail
        const thumbnail = anchor.find("img.poster").attr("src") ?? null;

        if (endpoint) {
            datas.push({
                title,
                endpoint,
                thumbnail,
                duration,
                resolution,
                updated_at,
                eps,
                rating,
            });
        }
    });

    /* ===============================
       PAGINATION
    =============================== */

    $(".wp-pagenavi a, .wp-pagenavi span").each((_, el) => {
        const num = parseInt($(el).text().trim(), 10);
        if (!isNaN(num)) pages.push(num);
    });

    const pagination = pages.length > 0 ? Math.max(...pages) : 1;

    /* ===============================
       FILTER DROPDOWN OPTIONS
    =============================== */

    const countries: FilterOption[] = [];
    const genres: FilterOption[] = [];
    const years: FilterOption[] = [];
    const media_types: FilterOption[] = [];

    // Country Select (panel filter)
    $("select")
        .eq(1)
        .find("option")
        .each((_, opt) => {
            const label = $(opt).text().trim();
            const value = $(opt).attr("value") ?? "";

            if (label && value) countries.push({ label, value });
        });

    // Genre Select
    $("select")
        .eq(2)
        .find("option")
        .each((_, opt) => {
            const label = $(opt).text().trim();
            const value = $(opt).attr("value") ?? "";

            if (label && value) genres.push({ label, value });
        });

    // Year Select
    $("select")
        .eq(3)
        .find("option")
        .each((_, opt) => {
            const label = $(opt).text().trim();
            const value = $(opt).attr("value") ?? "";

            if (label && value) years.push({ label, value });
        });

    // Media Type Select
    $("select")
        .eq(4)
        .find("option")
        .each((_, opt) => {
            const label = $(opt).text().trim();
            const value = $(opt).attr("value") ?? "";

            if (label && value) media_types.push({ label, value });
        });

    /* ===============================
       SIDEBAR MOST VIEWED
    =============================== */

    const most_viewed: SidebarItem[] = [];

    $("h4:contains('Terbanyak dilihat')")
        .next(".animeterbaru")
        .find(".polarpost")
        .each((_, el) => {
            const anchor = $(el).find("a");

            const title = anchor.text().trim();
            const href = anchor.attr("href") ?? "";
            const endpoint = extractEndpoint(href);

            const thumbnail =
                $(el).find("img.side-poster").attr("src") ?? null;

            const views =
                $(el).find(".genreser").last().text().trim() || null;

            if (endpoint) {
                most_viewed.push({
                    title,
                    endpoint,
                    thumbnail,
                    views,
                });
            }
        });

    /* ===============================
       SIDEBAR COMPLETE / ENDED
    =============================== */

    const completed: SidebarItem[] = [];

    $("h4:contains('Complete / Ended')")
        .next(".animeterbaru")
        .find(".polarpost")
        .each((_, el) => {
            const anchor = $(el).find("a");

            const title = anchor.text().trim();
            const href = anchor.attr("href") ?? "";
            const endpoint = extractEndpoint(href);

            const thumbnail =
                $(el).find("img.side-poster").attr("src") ?? null;

            const views =
                $(el).find(".genreser").last().text().trim() || null;

            if (endpoint) {
                completed.push({
                    title,
                    endpoint,
                    thumbnail,
                    views,
                });
            }
        });

    /* ===============================
       SIDEBAR GENRE + YEAR LIST
    =============================== */

    const sidebarGenres: string[] = [];
    const sidebarYears: string[] = [];

    $("h4:contains('Genre')")
        .next("ul.genrez")
        .find("a")
        .each((_, el) => {
            sidebarGenres.push($(el).text().trim());
        });

    $("h4:contains('Tahun')")
        .next("ul.genrez")
        .find("a")
        .each((_, el) => {
            sidebarYears.push($(el).text().trim());
        });

    /* ===============================
       FINAL RESULT
    =============================== */

    return {
        pagination,
        datas,

        filters: {
            countries,
            genres,
            years,
            media_types,
        },

        sidebar: {
            most_viewed,
            completed,
            genres: sidebarGenres,
            years: sidebarYears,
        },
    };
}

export async function scrapeCompletedSeries(
    res: AxiosResponse<string>
): Promise<CompletedSeriesResult> {
    const $ = load(res.data);

    const datas: CompletedSeriesCard[] = [];

    /* ===============================
       MAIN CARD LIST
       Selector: .row.item-list .col-6
    =============================== */

    $(".row.item-list .col-6").each((_, el) => {
        const element = $(el);

        // Link detail
        const href = element.find("a.poster").attr("href") ?? "";
        const endpoint = extractEndpoint(href);

        // Title
        const title =
            element
                .find("span.titit")
                .clone()
                .children()
                .remove()
                .end()
                .text()
                .trim() || "";

        // Thumbnail
        const thumbnail = element.find("img.poster").attr("src") ?? null;

        // Duration
        const duration = element.find("span.type").text().trim() || null;

        // Resolution
        const resolution =
            element.find("span.titit span").eq(0).text().trim() || null;

        // Updated At
        const updated_at =
            element.find("span.titit span").eq(1).text().trim() || null;

        // Episode Info
        const eps = element.find("span.tagw span.qua").text().trim() || null;

        // Rating
        const ratingRaw = element.find("span.rat").text().trim();
        const rating = ratingRaw
            ? ratingRaw.replace("★", "").replace(/\s+/g, " ").trim()
            : null;

        // Push only valid endpoint
        if (endpoint) {
            datas.push({
                title,
                endpoint,
                thumbnail,
                duration,
                resolution,
                updated_at,
                eps,
                rating,
            });
        }
    });

    /* ===============================
       PAGINATION TOTAL PAGE
       Example: last page = 14
    =============================== */

    let pagination = 1;

    // Ambil dari tombol page terakhir
    const lastPageText = $(".wp-pagenavi a.page").last().text().trim();

    if (lastPageText && !isNaN(Number(lastPageText))) {
        pagination = parseInt(lastPageText, 10);
    }

    // Fallback: ambil dari href terakhir
    const lastHref = $(".wp-pagenavi a.page").last().attr("href");

    if (lastHref) {
        const match = lastHref.match(/page=(\d+)/);
        if (match?.[1]) {
            pagination = parseInt(match[1], 10);
        }
    }

    return {
        pagination,
        datas,
    };
}

export async function scrapeMovie(
    res: AxiosResponse<string>
): Promise<MovieResult> {
    const $ = load(res.data);

    const datas: MovieItem[] = [];
    const pages: number[] = [];

    /* ==============================
       LOOP MOVIE CARD
    ============================== */

    $(".row.item-list .card").each((_, el) => {
        const anchor = $(el).find("a.poster");

        // Endpoint
        const href = anchor.attr("href") ?? "";
        const endpoint = href
            .replace("/detail/", "")
            .replaceAll("/", "")
            .trim();

        // Duration
        const duration = anchor.find("span.type").first().text().trim();

        // Thumbnail
        const thumbnail = anchor.find("img.poster").attr("src");

        // Title raw (text utama sebelum <br>)
        const titleRaw =
            anchor
                .find("span.titit")
                .clone()
                .children()
                .remove()
                .end()
                .text()
                .trim() ?? "";

        // Year extract (2025)
        const yearMatch = titleRaw.match(/\((\d{4})\)/);
        const year = yearMatch ? yearMatch[1] : null;

        // Resolution (480p / 720p & 480p)
        const resolution = anchor
            .find("span.titit span")
            .first()
            .text()
            .trim();

        // Updated At
        const updatedAt = anchor
            .find("span.titit span")
            .last()
            .text()
            .trim();

        // Rating
        const ratingText = anchor.find("span.rat").text().trim();
        const rating = ratingText
            ? ratingText.replace("★", "").replace(/\s+/g, " ").trim()
            : null;

        // Tag (WEB / BR)
        const tag = anchor.find("span.tagw span.qua").text().trim() || null;

        if (endpoint) {
            datas.push({
                title: titleRaw,
                year,
                duration,
                resolution,
                updated_at: updatedAt,
                rating,
                tag,
                thumbnail: thumbnail || undefined,
                endpoint,
            });
        }
    });

    /* ==============================
       PAGINATION
    ============================== */

    $(".wp-pagenavi a, .wp-pagenavi span").each((_, el) => {
        const num = parseInt($(el).text().trim(), 10);
        if (!isNaN(num)) pages.push(num);
    });

    const pagination = pages.length > 0 ? Math.max(...pages) : 1;

    return {
        pagination,
        datas,
    };
}

export async function scrapeGenres(
    res: AxiosResponse<string>
): Promise<GenreItem[]> {
    const $ = load(res.data);

    const datas: GenreItem[] = [];

    // Ambil hanya genrez pertama (Genre utama)
    $(".genrez")
        .first()
        .find(".cat-item a")
        .each((_, el) => {
            const title = $(el).text().trim();

            if (title) {
                datas.push({ title });
            }
        });

    return datas;
}

export async function scrapeDetailGenres(
    res: AxiosResponse<string>
): Promise<GenreDetailResult> {
    const $ = load(res.data);

    const datas: GenreDetailCard[] = [];

    /* ===============================
       ✅ FIX SELECTOR UNTUK /all
    ================================ */

    $(".row.item-list .card a.poster").each((_, el) => {
        const element = $(el);

        // Endpoint
        const href = element.attr("href") ?? "";
        const endpoint = extractEndpoint(href);

        // Title
        const title =
            element
                .find("span.titit")
                .clone()
                .children("span")
                .remove()
                .end()
                .text()
                .trim() ?? "";

        // Duration
        const duration = element.find("span.type").text().trim() || null;

        // Thumbnail
        const thumbnail = element.find("img.poster").attr("src") ?? null;

        // Quality
        const quality =
            element.find("span.titit span").first().text().trim() || null;

        // Updated At
        const updated_at =
            element.find("span.titit span").last().text().trim() || null;

        // Episode / Tag
        const eps = element.find("span.tagw span.qua").text().trim() || null;

        // Rating
        const ratingRaw = element.find("span.rat").text().trim();
        const rating = ratingRaw
            ? ratingRaw.replace("★", "").trim()
            : null;

        if (endpoint) {
            datas.push({
                title,
                endpoint,
                duration,
                quality,
                updated_at,
                eps,
                rating,
                thumbnail,
            });
        }
    });

    /* ===============================
       Pagination
    ================================ */

    const pages: number[] = [];

    $(".wp-pagenavi a, .wp-pagenavi span").each((_, el) => {
        const num = parseInt($(el).text().trim(), 10);
        if (!isNaN(num)) pages.push(num);
    });

    const pagination = pages.length > 0 ? Math.max(...pages) : 1;

    return {
        pagination,
        datas,
    };
}

export async function scrapeSearch(
    res: AxiosResponse<string>
): Promise<SearchResult> {
    const $ = load(res.data);

    const datas: SearchItem[] = [];
    const pages: number[] = [];

    /* ============================
       LOOP CARD SEARCH RESULT
    ============================ */

    $(".row.item-list .card").each((_, el) => {
        const titleRaw = $(el)
            .find("span.titit")
            .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim();

        const time = $(el).find("span.type").text().trim();

        const quality = $(el).find("span.titit span").first().text().trim();

        const updatedAt = $(el).find("span.titit span").last().text().trim();

        const eps = $(el).find("span.tagw span.qua").text().trim();

        const rating =
            $(el).find("span.rat").text().replace("★", "").trim() || "N/A";

        const thumbnail = $(el).find("img.poster").attr("src");

        const link = $(el).find("a.poster").attr("href");

        const endpoint = link
            ? link.replace("/detail/", "").replace("/", "")
            : null;

        datas.push({
            title: titleRaw,
            time,
            quality,
            updated_at: updatedAt,
            eps,
            rating,
            thumbnail: thumbnail || undefined,
            endpoint,
        });
    });

    /* ============================
       PAGINATION
    ============================ */

    $(".wp-pagenavi a, .wp-pagenavi span").each((_, el) => {
        const num = parseInt($(el).text().trim(), 10);
        if (!isNaN(num)) pages.push(num);
    });

    const pagination = pages.length > 0 ? Math.max(...pages) : 1;

    return {
        pagination,
        datas,
    };
}

export async function scrapeDetailAllType(
    params: DetailParams,
    res: AxiosResponse<string>
): Promise<DrakorDetailResult | { error: true; message: string }> {
    const { endpoint } = params;

    const $ = load(res.data);

    /* ===============================
       HEADERS
    =============================== */

    const headers = {
        Referer: `${process.env.DRAKORKITA_URL}/detail/${endpoint}/`,
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    };

    /* ===============================
       MAIN PARENT
    =============================== */

    const parent = $("div#sidebar_left");

    /* ===============================
       BASIC INFO
    =============================== */

    const title = parent
        .find("div.animefull div.infox > h1")
        .text()
        .trim();

    const titleAlt = parent
        .find("div.animefull div.infox > span.alter")
        .text()
        .trim();

    const synopsis = parent.find("div.sinopsis > p").text().trim();

    const thumbnail =
        parent.find("div.bigcover img").attr("src") ||
        parent.find("div.thumb img").attr("src");

    /* ===============================
       GENRES
    =============================== */

    const genres: string[] = [];

    parent.find("div.gnr a").each((_, el) => {
        genres.push($(el).text().trim());
    });

    /* ===============================
       RATING INFO
    =============================== */

    const score = parent
        .find("div.rating strong")
        .text()
        .replace("Score :", "")
        .trim();

    const ratingCount = parent
        .find("div.rating small")
        .text()
        .replace("Ratings", "")
        .trim();

    /* ===============================
       DETAIL INFO LIST
    =============================== */

    const info: DrakorDetailInfo = {};

    parent.find("ul.anf > li").each((_, el) => {
        const label = $(el).find("b").first().text().trim();

        let value = $(el)
            .find("b")
            .first()
            .parent()
            .find("span, a")
            .first()
            .text()
            .trim();

        if (!value) {
            value = $(el)
                .clone()
                .children("span")
                .children("b")
                .remove()
                .end()
                .text()
                .replace(":", "")
                .trim();
        }

        if (label && value) {
            info[label.toLowerCase().replace(/\s+/g, "_")] = value;
        }
    });

    /* ===============================
       STARS / CAST
    =============================== */

    const stars: DrakorStar[] = [];

    parent.find("li.mv-description a").each((_, el) => {
        stars.push({
            name: $(el).text().trim(),
            link: $(el).attr("href") || undefined,
        });
    });

    /* ===============================
       MOVIE ID + TAG
    =============================== */

    const onclick = parent
        .find("div.pagination a[onclick^='loadEpisode']")
        .first()
        .attr("onclick");

    if (!onclick) {
        return {
            error: true,
            message: "Movie ID tidak ditemukan",
        };
    }

    const movieIdAndTag = onclick.substring(
        onclick.indexOf("(") + 1,
        onclick.indexOf(")")
    );

    const movieId = movieIdAndTag.split(",")[0].replace(/'/g, "").trim();
    const tag = movieIdAndTag.split(",")[1].replace(/'/g, "").trim();

    /* ===============================
       GET EPISODE LIST
    =============================== */

    const episodeResponse = await axios.get<{
        episode_lists: string;
    }>(`${process.env.DRAKORKITA_URL}/api/episode.php?movie_id=${movieId}&tag=${tag}`, {
        headers,
    });

    const episodeListsHtml = episodeResponse.data.episode_lists;

    const $eps = load(episodeListsHtml);

    const episodeElements = $eps("p > a").toArray();

    /* ===============================
       LOOP EPISODES
    =============================== */

    const episodes: EpisodeItem[] = await Promise.all(
        episodeElements.map(async (epsEl, index) => {
            const wrap = $eps(epsEl).attr("onclick");

            if (!wrap) {
                return {
                    title: `Episode ${index + 1}`,
                    episode_id: "unknown",
                    resolutions: [],
                };
            }

            const epsIdAndTag = wrap.substring(
                wrap.indexOf("(") + 1,
                wrap.indexOf(")")
            );

            const epsId = epsIdAndTag.split(",")[0].replace(/'/g, "").trim();
            const epsTag = epsIdAndTag.split(",")[1].replace(/'/g, "").trim();

            /* ===============================
               GET SERVER INFO
            =============================== */

            const serverResponse = await axios.get<{
                data: { qua: string; server_id: string };
            }>(
                `${process.env.DRAKORKITA_URL}/api/server.php?episode_id=${epsId}&tag=${epsTag}`,
                { headers }
            );

            const { qua, server_id } = serverResponse.data.data;

            /* ===============================
               GET VIDEO LINKS
            =============================== */

            const videoResponse = await axios.get<{ file: string }>(
                `${process.env.DRAKORKITA_URL}/api/video.php?id=${epsId}&qua=${qua}&server_id=${server_id}&tag=${epsTag}`,
                { headers }
            );

            const splitFile = videoResponse.data.file.split(",");

            const resolutions: EpisodeResolution[] = splitFile.map((link) => {
                const resolutionMatch = link.match(/(\d{3,4})p/);

                return {
                    resolution: resolutionMatch
                        ? `${resolutionMatch[1]}p`
                        : "Unknown",
                    src: link.substring(link.indexOf("https")).trim(),
                };
            });

            return {
                title: `Episode ${index + 1}`,
                episode_id: epsId,
                resolutions,
            };
        })
    );

    /* ===============================
       FINAL RESULT
    =============================== */

    return {
        title,
        title_alt: titleAlt,
        synopsis,
        thumbnail,

        genres,

        rating: {
            score,
            count: ratingCount,
        },

        info,

        stars,

        total_episode_available: episodes.length,
        episodes,

        is_series: info.type?.toLowerCase().includes("tv") ?? false,
        is_movie: info.type?.toLowerCase().includes("movie") ?? false,
    };
}