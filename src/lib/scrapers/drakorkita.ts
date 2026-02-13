import { load } from "cheerio";
import { AxiosResponse } from "axios";
import {
    CompletedSeriesCard,
    CompletedSeriesResult,
    DrakorDetailInfo,
    DrakorDetailResult,
    DrakorStar,
    EpisodeItem,
    EpisodeResolution,
    GenreDetailCard,
    GenreDetailResult,
    GenreItem,
    HomeResult,
    LatestItem,
    MovieItem,
    MovieResult,
    OngoingSeriesResult,
    SearchDramaCard,
    SearchDramaResult,
    SeriesResult,
} from "@/app/types/drakor/drama";
import { extractEndpoint, extractYear } from "../helpers/helpers";
import { proxyFetchHTML } from "../proxyFetch";
import { getCache, setCache } from "../redisCache";
import { fetchWithBrowser } from "../fetchWithBrowser";
export const runtime = "nodejs";

export function scrapeHomePage(html: string): HomeResult {
    const $ = load(html);

    const scrapeSection = (rowIndex: number): LatestItem[] => {
        const items: LatestItem[] = [];

        const sectionRow = $("h4.heading1, h4.heading2")
            .eq(rowIndex)
            .next("div.row");

        sectionRow.find("div.card").each((_, card) => {
            const anchor = $(card).find("a.poster");

            const endpoint = extractEndpoint(anchor.attr("href") ?? "");

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

            const thumbnail = anchor.find("img.poster").attr("src") ?? null;

            const resolution =
                anchor.find("span.titit span").first().text().trim() || null;

            const updated_at =
                anchor.find("span.titit span").last().text().trim() || null;

            const eps = anchor.find("span.rate").text().trim() || null;

            const duration = anchor.find("span.type").text().trim() || null;

            const ratingRaw = anchor.find("span.rat").text().trim();
            const rating = ratingRaw ? ratingRaw.replace("★", "").trim() : null;

            if (endpoint) {
                items.push({
                    title: titleRaw,
                    year,
                    endpoint,
                    thumbnail,
                    eps,
                    duration,
                    resolution,
                    updated_at,
                    rating,
                });
            }
        });

        return items;
    };

    return {
        latest_eps: scrapeSection(0),
        latest_movies: scrapeSection(1),
        latest_series: scrapeSection(2),
    };
}

export function scrapeSeries(html: string): SeriesResult {
    const $ = load(html);

    const datas: SeriesResult["datas"] = [];
    const pages: number[] = [];

    $(".row.item-list .card").each((_, el) => {
        const anchor = $(el).find("a.poster");

        const title =
            anchor
                .find("span.titit")
                .clone()
                .children()
                .remove()
                .end()
                .text()
                .trim() ?? "";

        const endpoint = extractEndpoint(anchor.attr("href") ?? "");

        const thumbnail = anchor.find("img.poster").attr("src") ?? null;

        const duration = anchor.find("span.type").text().trim() || null;

        const resolution =
            anchor.find("span.titit span").first().text().trim() || null;

        const updated_at =
            anchor.find("span.titit span").last().text().trim() || null;

        const eps = anchor.find("span.tagw span.qua").text().trim() || null;

        const ratingRaw = anchor.find("span.rat").text().trim();
        const rating = ratingRaw ? ratingRaw.replace("★", "").trim() : null;

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

    // Pagination
    $(".wp-pagenavi a, .wp-pagenavi span").each((_, el) => {
        const num = parseInt($(el).text().trim(), 10);
        if (!isNaN(num)) pages.push(num);
    });

    return {
        pagination: pages.length > 0 ? Math.max(...pages) : 1,
        datas,
    };
}

export function scrapeOngoingSeries(html: string): OngoingSeriesResult {
    const $ = load(html);

    const datas: OngoingSeriesResult["datas"] = [];
    const pages: number[] = [];

    // ===============================
    // MAIN LIST
    // ===============================
    $(".row.item-list .card").each((_, el) => {
        const anchor = $(el).find("a.poster");

        const endpoint = extractEndpoint(anchor.attr("href") ?? "");

        const title =
            anchor
                .find("span.titit")
                .clone()
                .children()
                .remove()
                .end()
                .text()
                .trim() ?? "";

        const thumbnail = anchor.find("img.poster").attr("src") ?? null;

        const duration = anchor.find("span.type").text().trim() || null;

        const resolution =
            anchor.find("span.titit span").first().text().trim() || null;

        const updated_at =
            anchor.find("span.titit span").last().text().trim() || null;

        const eps = anchor.find("span.tagw span.qua").text().trim() || null;

        const ratingRaw = anchor.find("span.rat").text().trim();
        const rating = ratingRaw ? ratingRaw.replace("★", "").trim() : null;

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

    // ===============================
    // PAGINATION
    // ===============================
    $(".wp-pagenavi a, .wp-pagenavi span").each((_, el) => {
        const num = parseInt($(el).text().trim(), 10);
        if (!isNaN(num)) pages.push(num);
    });

    const pagination = pages.length > 0 ? Math.max(...pages) : 1;

    // ===============================
    // FILTERS + SIDEBAR (optional)
    // ===============================
    return {
        pagination,
        datas,
        filters: {
            countries: [],
            genres: [],
            years: [],
            media_types: [],
        },
        sidebar: {
            most_viewed: [],
            completed: [],
            genres: [],
            years: [],
        },
    };
}

export function scrapeCompletedSeries(
    html: string
): CompletedSeriesResult {
    const $ = load(html);

    const datas: CompletedSeriesCard[] = [];

    /* ===============================
       MAIN CARD LIST
    =============================== */

    $(".row.item-list .col-6").each((_, el) => {
        const element = $(el);

        // Endpoint
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
        const eps =
            element.find("span.tagw span.qua").text().trim() || null;

        // Rating
        const ratingRaw = element.find("span.rat").text().trim();
        const rating = ratingRaw
            ? ratingRaw.replace("★", "").replace(/\s+/g, " ").trim()
            : null;

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
    =============================== */

    let pagination = 1;

    const lastPageText = $(".wp-pagenavi a.page").last().text().trim();

    if (lastPageText && !isNaN(Number(lastPageText))) {
        pagination = parseInt(lastPageText, 10);
    }

    return {
        pagination,
        datas,
    };
}

export function scrapeMovie(html: string): MovieResult {
    const $ = load(html);

    const datas: MovieItem[] = [];
    const pages: number[] = [];

    /* ==============================
       LOOP MOVIE CARD
    ============================== */

    $(".row.item-list .card").each((_, el) => {
        const anchor = $(el).find("a.poster");

        const href = anchor.attr("href") ?? "";
        const endpoint = href.replace("/detail/", "").replaceAll("/", "").trim();

        const duration = anchor.find("span.type").first().text().trim() || null;

        const thumbnail = anchor.find("img.poster").attr("src") ?? null;

        const titleRaw =
            anchor
                .find("span.titit")
                .clone()
                .children()
                .remove()
                .end()
                .text()
                .trim() ?? "";

        const yearMatch = titleRaw.match(/\((\d{4})\)/);
        const year = yearMatch ? yearMatch[1] : null;

        const resolution =
            anchor.find("span.titit span").first().text().trim() || null;

        const updatedAt =
            anchor.find("span.titit span").last().text().trim() || null;

        const ratingText = anchor.find("span.rat").text().trim();
        const rating = ratingText
            ? ratingText.replace("★", "").replace(/\s+/g, " ").trim()
            : null;

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
                thumbnail,
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

export function scrapeGenres(html: string): GenreItem[] {
    const $ = load(html);

    const datas: GenreItem[] = [];

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

export function scrapeDetailGenres(html: string): GenreDetailResult {
    const $ = load(html);

    const datas: GenreDetailCard[] = [];

    $(".row.item-list .card a.poster").each((_, el) => {
        const element = $(el);

        // Endpoint
        const href = element.attr("href") ?? "";
        const endpoint = extractEndpoint(href);

        // Title
        const title = element
            .find("span.titit")
            .clone()
            .children("span")
            .remove()
            .end()
            .text()
            .trim();

        // Duration
        const duration = element.find("span.type").text().trim() || null;

        // Thumbnail
        const thumbnail = element.find("img.poster").attr("src") ?? null;

        // Resolution
        const resolution =
            element.find("span.titit span").first().text().trim() || null;

        // Updated At
        const updated_at =
            element.find("span.titit span").last().text().trim() || null;

        // Episode / Tag
        const eps = element.find("span.tagw span.qua").text().trim() || null;

        // Rating
        const ratingRaw = element.find("span.rat").text().trim();
        const rating = ratingRaw ? ratingRaw.replace("★", "").trim() : null;

        if (endpoint) {
            datas.push({
                title,
                endpoint,
                duration,
                resolution,
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

    return {
        pagination: pages.length > 0 ? Math.max(...pages) : 1,
        datas,
    };
}

export function scrapeSearch(html: string): SearchDramaResult {
    const $ = load(html);

    const datas: SearchDramaCard[] = [];
    const pages: number[] = [];

    // ===============================
    // LOOP CARD RESULT
    // ===============================
    $(".row.item-list .card").each((_, el) => {
        const anchor = $(el).find("a.poster");

        const title =
            anchor
                .find("span.titit")
                .clone()
                .children()
                .remove()
                .end()
                .text()
                .trim() || "";

        const endpoint =
            anchor.attr("href")?.split("/detail/")[1]?.replace("/", "") ?? null;

        const thumbnail = anchor.find("img.poster").attr("src") ?? null;

        const time = anchor.find("span.type").text().trim() || null;

        const resolution =
            anchor.find("span.titit span").first().text().trim() || null;

        const updated_at =
            anchor.find("span.titit span").last().text().trim() || null;

        const eps =
            anchor.find("span.tagw span.qua").text().trim() || null;

        const ratingRaw = anchor.find("span.rat").text().trim();
        const rating = ratingRaw ? ratingRaw.replace("★", "").trim() : null;

        if (endpoint) {
            datas.push({
                title,
                endpoint,
                time,
                thumbnail,
                resolution,
                updated_at,
                eps,
                rating,
            });
        }
    });

    // ===============================
    // PAGINATION
    // ===============================
    $(".wp-pagenavi a, .wp-pagenavi span").each((_, el) => {
        const num = parseInt($(el).text().trim(), 10);
        if (!isNaN(num)) pages.push(num);
    });

    return {
        pagination: pages.length > 0 ? Math.max(...pages) : 1,
        datas,
    };
}

export async function scrapeDetailAllType(
    endpoint: string,
    html: string
): Promise<DrakorDetailResult | { error: true; message: string }> {
    const $ = load(html);

    const parent = $("div#sidebar_left");

    /* ===============================
       BASIC INFO
    =============================== */

    const title = parent.find("div.infox > h1").text().trim();

    const title_alt = parent.find("div.infox > span.alter").text().trim();

    const synopsis = parent.find("div.sinopsis > p").text().trim();

    const thumbnail =
        parent.find("div.bigcover img").attr("src") ||
        parent.find("div.thumb img").attr("src") ||
        null;

    /* ===============================
       GENRES
    =============================== */

    const genres: string[] = [];

    parent.find("div.gnr a").each((_, el) => {
        genres.push($(el).text().trim());
    });

    /* ===============================
       RATING
    =============================== */

    const score = parent
        .find("div.rating strong")
        .text()
        .replace("Score :", "")
        .trim();

    const count = parent
        .find("div.rating small")
        .text()
        .replace("Ratings", "")
        .trim();

    /* ===============================
       INFO LIST
    =============================== */

    const info: DrakorDetailInfo = {};

    parent.find("ul.anf > li").each((_, el) => {
        const label = $(el).find("b").first().text().trim();

        const value = $(el)
            .clone()
            .children("b")
            .remove()
            .end()
            .text()
            .replace(":", "")
            .trim();

        if (label && value) {
            info[label.toLowerCase().replace(/\s+/g, "_")] = value;
        }
    });

    /* ===============================
       STARS
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

    const inside = onclick.substring(
        onclick.indexOf("(") + 1,
        onclick.indexOf(")")
    );

    const movieId = inside.split(",")[0].replace(/'/g, "").trim();
    const tag = inside.split(",")[1].replace(/'/g, "").trim();

    /* ===============================
       EPISODE LIST (Proxy)
    =============================== */

    const episodeRaw = await proxyFetchHTML(
        `${process.env.DRAKORKITA_URL}/api/episode.php?movie_id=${movieId}&tag=${tag}`
    );

    // ✅ parse JSON response
    const episodeJson = JSON.parse(episodeRaw);

    // ✅ ambil HTML episode list
    const episodeListsHtml = episodeJson.episode_lists;

    if (!episodeListsHtml) {
        return {
            error: true,
            message: "Episode list kosong atau tidak ditemukan",
        };
    }

    // ✅ baru load ke cheerio
    const $eps = load(episodeListsHtml);

    const episodeElements = $eps("p > a").toArray();

    /* ===============================
       LOOP EPISODES
    =============================== */

    const episodes: EpisodeItem[] = episodeElements.map((el, index) => {

        const epsId = inside.split(",")[0].replace(/'/g, "").trim()
        const epsTag = inside.split(",")[1].replace(/'/g, "").trim() // ✅ INI PENTING

        const episodeTitle = $eps(el).text().trim() || `Episode ${index + 1}`

        return {
            title: episodeTitle,
            episode_id: epsId,
            tag: epsTag, // ✅ simpan tag benernya
            resolutions: [],
        }
    })

    /* ===============================
       FINAL RESULT
    =============================== */

    return {
        title,
        title_alt,
        synopsis,
        thumbnail,

        genres,

        rating: {
            score,
            count,
        },

        info,
        stars,

        total_episode_available: episodes.length,
        episodes,

        is_series: info.type?.toLowerCase().includes("tv") ?? false,
        is_movie: info.type?.toLowerCase().includes("movie") ?? false,
    };
}