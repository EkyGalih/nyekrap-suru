export async function fetchHTMLAnime(url: string): Promise<string> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    ]

    const randomUA =
        userAgents[Math.floor(Math.random() * userAgents.length)]

    const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
        headers: {
            "User-Agent": randomUA,
            "Accept":
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": process.env.OTAKUDESU_URL!,
            "Connection": "keep-alive",
        },
    })

    clearTimeout(timeout)

    if (!res.ok) {
        throw new Error(`Fetch gagal: ${res.status}`)
    }

    return res.text()
}