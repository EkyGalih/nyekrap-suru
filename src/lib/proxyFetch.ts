let lastWorkingProxy: ((url: string) => string) | null = null;

const FREE_PROXIES = [
    (url: string) =>
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,

    (url: string) =>
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,

    (url: string) =>
        `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,

    (url: string) =>
        `https://corsproxy.io/?${encodeURIComponent(url)}`,

    (url: string) =>
        `https://cors.isomorphic-git.org/${url}`,
];

async function fetchFromProxy(
    proxyBuilder: (url: string) => string,
    targetUrl: string
): Promise<string> {
    const proxyUrl = proxyBuilder(targetUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
        console.log("⚡ TRY:", proxyUrl);

        const res = await fetch(proxyUrl, {
            cache: "no-store",
            signal: controller.signal,
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const html = await res.text();

        if (!html || html.length < 200) {
            throw new Error("HTML kosong / diblokir");
        }

        console.log("✅ SUCCESS:", proxyUrl);
        return html;
    } finally {
        clearTimeout(timeout);
    }
}

export async function proxyFetchHTML(targetUrl: string): Promise<string> {
    // 1. Fast path: proxy terakhir sukses
    if (lastWorkingProxy) {
        try {
            return await fetchFromProxy(lastWorkingProxy, targetUrl);
        } catch {
            console.log("⚠️ Last proxy failed, fallback race...");
        }
    }

    // 2. Jalankan semua proxy tapi simpan error detail
    const errors: string[] = [];

    const tasks = FREE_PROXIES.map(async (proxy) => {
        try {
            const html = await fetchFromProxy(proxy, targetUrl);

            lastWorkingProxy = proxy;
            return html;
        } catch (err) {
            errors.push(`${proxy(targetUrl)} → ${String(err)}`);
            throw err;
        }
    });

    try {
        return await Promise.any(tasks);
    } catch {
        throw new Error(
            `Semua proxy gagal.\n\nDetail:\n${errors.join("\n")}`
        );
    }
}