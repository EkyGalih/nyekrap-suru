
import { GenreItem } from "@/app/types/anime/anime"
import { ChapterResult, DaftarResult, GenreResult, KomikuChapter, KomikuDetail, KomikuGenre, KomikuHotItem, KomikUpdatedItem, KomikuSearchItem, KomikuSearchResult, MangaItem } from "@/app/types/komik/manga"
import * as cheerio from "cheerio"

function parseViewers(text: string | null): number | null {
    if (!text) return null

    const match = text.match(/^([\d.,]+(?:jt|rb)?)/i)
    if (!match) return null

    const raw = match[1].toLowerCase()
    const num = parseFloat(raw.replace(",", "."))

    if (raw.includes("jt")) return Math.round(num * 1_000_000)
    if (raw.includes("rb")) return Math.round(num * 1_000)

    return Math.round(num)
}

export function scrapeHotKomiku(html: string): KomikuHotItem[] {
    const $ = cheerio.load(html)
    const results: KomikuHotItem[] = []

    $("div.bge").each((_, el) => {
        const link = $(el).find(".bgei a").attr("href") ?? ""

        const title = $(el).find(".kan h3").text().trim()

        const thumbnail =
            $(el).find(".bgei img").attr("src") ||
            $(el).find(".bgei img").attr("data-src") ||
            null

        const type =
            $(el).find(".tpe1_inf b").first().text().trim() || null

        const judulText = $(el).find(".judul2").text().trim()
        const viewers = parseViewers(judulText)

        const newestChapter = $(el)
            .find(".new1")
            .last()
            .find("span")
            .last()
            .text()
            .trim() || null

        const endpoint = link
            .replace("https://komiku.org/", "")
            .replace(/^manga\//, "")
            .replace(/\/$/, "")

        results.push({
            title,
            thumbnail,
            newest_chapter: newestChapter,
            viewers,
            endpoint,
            type,
        })
    })

    return results
}

export function scrapeUpdatedKomik(html: string): KomikUpdatedItem[] {
    const $ = cheerio.load(html)
    const datas: KomikUpdatedItem[] = []

    $("div.bge").each((_, el) => {
        const link = $(el).find(".bgei a").attr("href") || ""

        const title = $(el).find(".kan h3").text().trim()

        const thumbnail =
            $(el).find(".bgei img").attr("src") ||
            $(el).find(".bgei img").attr("data-src") ||
            null

        const type = $(el).find(".tpe1_inf b").first().text().trim()

        const judul2 = $(el)
            .find(".judul2")
            .text()
            .replace(/\s+/g, " ")
            .trim()

        const viewMatch = judul2.match(/([\d.,]+[a-zA-Z]*)\s+pembaca/i)
        const timeMatch = judul2.match(/\|\s*(.*?)$/)

        const views = viewMatch ? viewMatch[1] : null
        const updated_at = timeMatch ? timeMatch[1].trim() : null

        const newestChapter = $(el)
            .find(".new1")
            .last()
            .find("span")
            .last()
            .text()
            .trim()

        const endpoint = link
            .replace("https://komiku.org/manga/", "")
            .replace(/\/$/, "")

        datas.push({
            title,
            thumbnail,
            endpoint,
            type,
            newest_chapter: newestChapter,
            views,
            updated_at,
        })
    })

    return datas
}

export function scrapeKomikuDetail(
    html: string,
    endpoint: string
): KomikuDetail {
    const $ = cheerio.load(html)

    // =========================
    // BASIC INFO
    // =========================
    const title = $("#Judul h1 span").text().trim()
    const titleIndo = $("#Judul .j2").text().trim() || null

    const thumbnail =
        $("#Informasi .ims img").attr("src") ||
        $("#Informasi .ims img").attr("data-src") ||
        null

    const description = $("#Informasi .desc").text().trim()

    // =========================
    // INFO TABLE
    // =========================
    const info: Record<string, string> = {}

    $(".inftable tr").each((_, el) => {
        const key = $(el).find("td").first().text().trim()
        const value = $(el).find("td").last().text().trim()

        if (key && value) {
            info[key] = value
        }
    })

    // =========================
    // GENRES
    // =========================
    const genres: string[] = []

    $(".genre a span").each((_, el) => {
        genres.push($(el).text().trim())
    })

    // =========================
    // CHAPTER LIST
    // =========================
    const chapters: KomikuChapter[] = []

    $("#daftarChapter tr").each((_, el) => {
        const link = $(el).find(".judulseries a").attr("href")
        if (!link) return

        const chapterTitle = $(el)
            .find(".judulseries a span")
            .text()
            .trim()

        const viewsText = $(el)
            .find(".pembaca i")
            .text()
            .trim()

        const releaseDate = $(el)
            .find(".tanggalseries")
            .text()
            .trim()

        chapters.push({
            title: chapterTitle,
            endpoint: link.replace(/^\/|\/$/g, ""),
            views: viewsText
                ? Number(viewsText.replace(/\./g, ""))
                : 0,
            release_date: releaseDate,
        })
    })

    // sort newest first
    chapters.sort((a, b) => {
        const aNum = parseFloat(a.title.replace(/[^\d.]/g, ""))
        const bNum = parseFloat(b.title.replace(/[^\d.]/g, ""))
        return bNum - aNum
    })

    return {
        endpoint,
        title,
        title_indonesia: titleIndo,
        thumbnail,
        description,
        info,
        genres,
        total_chapter: chapters.length,
        chapters,
    }
}

export async function scrapeKomikuChapter(
    endpoint: string,
    baseUrl: string
): Promise<ChapterResult> {
    const url = `${baseUrl}/${endpoint}`

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0",
        },
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch chapter page")
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // ======================
    // TITLE
    // ======================
    const title = $("#Judul h1").text().trim() || null

    const titleComic =
        $("#Judul a[rel='tag']").first().text().trim() || null

    // ======================
    // IMAGES
    // ======================
    const images: string[] = []

    $("#Baca_Komik img").each((_, el) => {
        const src = $(el).attr("src")
        if (src && src.includes("img.komiku.org")) {
            images.push(src)
        }
    })

    // ======================
    // META
    // ======================
    const chapterInfo = $(".chapterInfo")

    const chapterNumber =
        chapterInfo.attr("valuechapter") ?? null

    const totalPages =
        chapterInfo.attr("valuegambar") ?? images.length

    // ======================
    // NAVIGATION
    // ======================
    const nextHref = $(".nxpr a.rl").attr("href") ?? null
    const prevHref =
        $(".nxpr a")
            .not(".rl")
            .first()
            .attr("href") ?? null

    const clean = (link: string | null) =>
        link
            ? link
                .replace(baseUrl, "")
                .replace(/^\/|\/$/g, "")
            : null

    return {
        endpoint,
        title,
        title_comic: titleComic,
        chapter_number: chapterNumber,
        total_images: images.length,
        total_pages: totalPages,
        images,
        next_chapter: clean(nextHref),
        prev_chapter: clean(prevHref),
    }
}

export function scrapeKomikuDaftar(html: string): DaftarResult {
    const $ = cheerio.load(html)
    const datas: MangaItem[] = []

    $(".manga-grid article.manga-card").each((_, el) => {
        const link = $(el).find("h4 a").attr("href") || ""
        const title = $(el).find("h4 a").text().trim()

        const thumbnail =
            $(el).find("img").attr("data-src") ||
            $(el).find("img").attr("src") ||
            null

        const meta = $(el).find(".meta").text().trim()
        const lines = meta.split("\n").map(v => v.trim()).filter(Boolean)

        let type: string | null = null
        let genre: string | null = null
        let status: string | null = null

        if (lines.length > 0) {
            const parts = lines[0].split("•").map(v => v.trim())
            type = parts[0] || null
            genre = parts[1] || null
        }

        const statusLine = lines.find(v =>
            v.toLowerCase().startsWith("status:")
        )

        if (statusLine) {
            status = statusLine.replace(/status:/i, "").trim()
        }

        const endpoint = link
            .replace("/manga/", "")
            .replace(/\//g, "")

        datas.push({
            title,
            endpoint,
            thumbnail,
            type,
            genre,
            status,
        })
    })

    // pagination
    let currentPage = 1
    let totalPages = 1

    $(".pagination a, .pagination span").each((_, el) => {
        const text = $(el).text().trim()
        const num = parseInt(text, 10)

        if (!isNaN(num)) {
            totalPages = Math.max(totalPages, num)
            if ($(el).hasClass("current")) {
                currentPage = num
            }
        }
    })

    return {
        pagination: {
            currentPage,
            totalPages,
        },
        datas,
    }
}

export function scrapeKomikuSearch(html: string): KomikuSearchResult {
    const $ = cheerio.load(html)

    const datas: KomikuSearchItem[] = []

    $(".bge").each((_, el) => {
        const title = $(el).find(".kan h3").text().trim()

        const link = $(el).find(".kan h3 a").attr("href") || ""
        const endpoint = link
            .replace("/manga/", "")
            .replace(/\//g, "")

        const thumbnail =
            $(el).find(".bgei img").attr("src") || null

        const type = $(el)
            .find(".tpe1_inf b")
            .text()
            .trim() || null

        const genreRaw = $(el)
            .find(".tpe1_inf")
            .text()
            .replace(type || "", "")
            .trim()

        const genre = genreRaw || null

        const updated =
            $(el).find(".kan p").text().trim() || null

        const firstChapter =
            $(el)
                .find(".new1")
                .first()
                .find("span")
                .last()
                .text()
                .trim() || null

        const latestChapter =
            $(el)
                .find(".new1")
                .last()
                .find("span")
                .last()
                .text()
                .trim() || null

        datas.push({
            title,
            endpoint,
            thumbnail,
            type,
            genre,
            updated,
            first_chapter: firstChapter,
            latest_chapter: latestChapter,
        })
    })

    // pagination tidak jelas di halaman api.komiku.org
    // jadi kita default 1
    const pagination = 1

    return {
        pagination,
        datas,
    }
}

export async function scrapeKomikuGenres(): Promise<KomikuGenre[]> {
    const res = await fetch(process.env.KOMIKU_URL2!, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/121 Safari/537.36",
        },
        cache: "no-store",
    })

    if (!res.ok) {
        throw new Error("Failed to fetch Komiku homepage")
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    const datas: KomikuGenre[] = []

    $("ul.genre li a").each((_, el) => {
        const title = $(el).text().trim()
        const href = $(el).attr("href")

        if (!href || !href.startsWith("/genre/")) return

        const endpoint = href
            .replace("/genre/", "")
            .replace(/\//g, "")

        datas.push({
            title,
            endpoint,
        })
    })

    return datas
}

export function scrapeDetailGenre(html: string): GenreResult {
    const $ = cheerio.load(html)
    const datas: GenreItem[] = []

    $(".bge").each((_, el) => {
        const link = $(el).find(".bgei a").attr("href") || ""

        const endpoint = link
            ? link
                .replace("https://komiku.org/manga/", "")
                .replace("https://komiku.org/", "")
                .replace(/\/$/, "")
            : null

        const thumbnail = $(el).find(".bgei img").attr("src") || null

        const type = $(el).find(".tpe1_inf b").text().trim() || null

        const genre = $(el)
            .find(".tpe1_inf")
            .text()
            .replace(type ?? "", "")
            .trim() || null

        const title = $(el).find(".kan h3").text().trim()

        const meta = $(el).find(".judul2").text().trim()

        const description = $(el).find(".kan p").text().trim()

        const awalLink = $(el).find(".new1 a").first().attr("href") || null
        const terbaruLink = $(el).find(".new1 a").last().attr("href") || null

        const awalChapter = $(el)
            .find(".new1")
            .first()
            .text()
            .replace("Awal:", "")
            .trim()

        const terbaruChapter = $(el)
            .find(".new1")
            .last()
            .text()
            .replace("Terbaru:", "")
            .trim()

        datas.push({
            title,
            endpoint,
            thumbnail,
            type,
            genre,
            views_info: meta,
            description,
            first_chapter: {
                title: awalChapter,
                endpoint: awalLink ? awalLink.replace(/^\/|\/$/g, "") : null,
            },
            latest_chapter: {
                title: terbaruChapter,
                endpoint: terbaruLink ? terbaruLink.replace(/^\/|\/$/g, "") : null,
            },
        })
    })

    // infinite scroll next page
    let nextPage: string | null = null
    const hx = $("span[hx-get]").attr("hx-get")
    if (hx) nextPage = hx

    return {
        total: datas.length,
        next_page: nextPage,
        datas,
    }
}