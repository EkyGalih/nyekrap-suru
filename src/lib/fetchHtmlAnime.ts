import { getRandomProxy, removeProxy } from "./proxyManager"
import { ProxyAgent, fetch as undiciFetch } from "undici"

export async function fetchHTMLAnime(url: string) {
    const proxy = getRandomProxy()

    const dispatcher = proxy
        ? new ProxyAgent(`http://${proxy}`)
        : undefined

    try {
        const res = await undiciFetch(url, {
            dispatcher, // ⬅️ bukan agent
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html,application/xhtml+xml",
            },
        })

        if (!res.ok) {
            const body = await res.text().catch(() => "")
            console.log("SCRAPE STATUS:", res.status)
            console.log("SCRAPE BODY:", body.slice(0, 300))
            throw new Error(`Fetch gagal: ${res.status}`)
        }

        return await res.text()
    } catch (err) {
        if (proxy) removeProxy(proxy)
        throw err
    }
}