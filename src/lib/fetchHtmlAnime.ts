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

        if (!res.ok) throw new Error("Bad status")

        return await res.text()
    } catch (err) {
        if (proxy) removeProxy(proxy)
        throw err
    }
}