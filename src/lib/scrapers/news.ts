import { NewsItem } from "@/app/types/news";
import { load } from "cheerio";

export function scrapeNewsPage(html: string): NewsItem[] {
    const $ = load(html);
    const items: NewsItem[] = [];

    // Target kita adalah container berita
    $(".client2 .card.card-shadow").each((_, card) => {
        const $card = $(card);

        // 1. Ambil Title & Endpoint
        const titleAnchor = $card.find("h5.font-medium a");
        const title = titleAnchor.text().trim();
        const fullUrl = titleAnchor.attr("href") ?? "";
        // Extract slug dari URL (mengambil bagian setelah /detail/)
        const endpoint = fullUrl.split("/detail/")[1] ?? "";

        // 2. Ambil Meta Data (Tanggal & Author)
        const date = $card.find(".no-block.font-13 span").first().text().trim();
        const author = $card.find(".no-block.font-13 a.link").text().trim();

        // 3. Ambil Excerpt (Ringkasan berita)
        const excerpt = $card.find("p.m-t-20").text().trim();

        // 4. Ambil Thumbnail
        const thumbnail = $card.find("img.card-img-top").attr("src") ?? null;

        if (endpoint) {
            items.push({
                title,
                date,
                author,
                excerpt,
                endpoint,
                thumbnail,
            });
        }
    });

    return items;
}

export async function scrapeFullContent(html: string) {
    const $ = load(html);
    // Selektor ini disesuaikan dengan isi konten di mytools.web.id atau rinjani
    // Biasanya konten artikel ada di dalam tag <article> atau class .entry-content
    const contentHtml = $(".p-30").html() || "";
    return contentHtml.trim();
}