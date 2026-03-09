export async function proxyFetchHTML(targetUrl: string): Promise<string> {
  const keysRaw = process.env.SCRAPERAPI_KEY
  if (!keysRaw) throw new Error("SCRAPERAPI_KEY belum diset")

  const keys = keysRaw.split(",").map(k => k.trim()).filter(Boolean)

  if (keys.length === 0) {
    throw new Error("Tidak ada API key tersedia")
  }

  let lastError: any = null

  for (const apiKey of keys) {
    const build = (extra: string) =>
      `https://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}${extra}`

    const variants = [
      { name: "standard", url: build("") },
      { name: "premium", url: build("&premium=true") },
    ]

    for (const v of variants) {
      try {
        console.log(`🔄 SCRAPERAPI [${apiKey.slice(0, 6)}...] → ${v.name}`)

        const res = await fetch(v.url, { cache: "no-store" })

        const body = await res.text()

        if (res.ok && body && body.length > 200) {
          return body
        }

        // kalau quota habis atau unauthorized
        if (res.status === 401 || res.status === 403 || res.status === 429) {
          console.log(`⚠️ Key bermasalah: ${apiKey.slice(0, 6)}...`)
          break // pindah ke key berikutnya
        }

        lastError = new Error(`Status ${res.status}`)
      } catch (err) {
        lastError = err
      }
    }
  }

  throw new Error(`Semua ScraperAPI key gagal. Last error: ${lastError}`)
}