/**
 * Proxy fallback fetch (gratis)
 * Untuk bypass blokir host scraping di Vercel
 */

const FREE_PROXIES = [
  // ✅ AllOrigins
  (url: string) =>
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,

  // ✅ Codetabs Proxy
  (url: string) =>
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,

  // ✅ ThingProxy
  (url: string) =>
    `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,

  // ✅ CorsProxy.io
  (url: string) =>
    `https://corsproxy.io/?${encodeURIComponent(url)}`,

  // ✅ Cors.isomorphic-git (kadang hidup kadang mati)
  (url: string) =>
    `https://cors.isomorphic-git.org/${url}`,
];

/**
 * Fetch HTML dengan fallback proxy gratis
 */
export async function proxyFetchHTML(targetUrl: string): Promise<string> {
  let lastError: unknown = null;

  for (const buildProxy of FREE_PROXIES) {
    const proxyUrl = buildProxy(targetUrl);

    try {
      console.log("TRY PROXY:", proxyUrl);

      const res = await fetch(proxyUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        lastError = `Proxy failed: ${res.status}`;
        continue;
      }

      const html = await res.text();

      // kalau html kosong → skip
      if (!html || html.length < 200) {
        lastError = "HTML kosong dari proxy";
        continue;
      }

      console.log("SUCCESS PROXY:", proxyUrl);

      return html;
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw new Error(
    `Semua proxy gratis gagal. Error terakhir: ${String(lastError)}`
  );
}