import { ProxyAgent, fetch as undiciFetch } from "undici"

const SOURCES = [
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/https.txt",
    "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt"
]

let proxyPool: string[] = []

async function fetchSources(): Promise<string[]> {
    const results = await Promise.all(
        SOURCES.map(async (url) => {
            try {
                const res = await fetch(url)
                const text = await res.text()
                return text.split("\n").map(p => p.trim()).filter(Boolean)
            } catch {
                return []
            }
        })
    )

    return [...new Set(results.flat())]
}


async function testProxy(proxy: string): Promise<boolean> {
    try {
        const dispatcher = new ProxyAgent(`http://${proxy}`)

        const res = await undiciFetch("https://httpbin.org/ip", {
            dispatcher,
            signal: AbortSignal.timeout(4000),
        })

        return res.ok
    } catch {
        return false
    }
}

export async function refreshProxyPool() {
    const list = await fetchSources()
    const alive: string[] = []

    const chunkSize = 50

    for (let i = 0; i < list.length; i += chunkSize) {
        const chunk = list.slice(i, i + chunkSize)

        const results = await Promise.all(
            chunk.map(async (proxy) => {
                const ok = await testProxy(proxy)
                if (ok) alive.push(proxy)
            })
        )
    }

    proxyPool = alive
    console.log("Proxy hidup:", proxyPool.length)
}

export function getRandomProxy() {
    if (!proxyPool.length) return null
    return proxyPool[Math.floor(Math.random() * proxyPool.length)]
}

export function removeProxy(proxy: string) {
    proxyPool = proxyPool.filter(p => p !== proxy)
}