export async function fetchHTMLAnime(url: string): Promise<string> {
    // random delay 2-5 detik
    const delay = Math.floor(Math.random() * 3000) + 2000
    await new Promise((r) => setTimeout(r, delay))

    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    ]

    const randomUA =
        userAgents[Math.floor(Math.random() * userAgents.length)]

    const res = await fetch(url, {
        headers: {
            "User-Agent": randomUA,
            Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Referer: process.env.OTAKUDESU_URL!,
        },
        cache: "no-store",
    })

    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(
            `Fetch HTML gagal: ${res.status}. body: ${text.slice(0, 300)}`
        )
    }

    return res.text()
}