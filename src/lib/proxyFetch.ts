export async function proxyFetchHTML(targetUrl: string): Promise<string> {
  const apiKey = process.env.SCRAPERAPI_KEY
  if (!apiKey) throw new Error("SCRAPERAPI_KEY belum diset di ENV")

  const build = (extra: string) =>
    `https://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}${extra}`

  const variants = [
    { name: "standard", url: build("") },
    { name: "premium", url: build("&premium=true") },
  ]

  let lastStatus: number | null = null
  let lastBody = ""

  for (const v of variants) {
    console.log("⚡ SCRAPERAPI FETCH:", v.name, v.url)

    const res = await fetch(v.url, { cache: "no-store" })
    lastStatus = res.status
    lastBody = await res.text()

    if (res.ok) {
      if (!lastBody || lastBody.length < 200) {
        throw new Error(`HTML kosong dari ScraperAPI (${v.name})`)
      }
      return lastBody
    }

    const bodyLower = (lastBody || "").toLowerCase()

    // Kalau ini kasus protected domains, lanjut coba premium
    const looksProtected =
      bodyLower.includes("protected domains") ||
      bodyLower.includes("premium=true") ||
      bodyLower.includes("ultra_premium=true")

    // kalau bukan kasus protected, jangan buang waktu coba premium
    if (!looksProtected) break
  }

  const snippet = (lastBody || "").slice(0, 400)
  throw new Error(`ScraperAPI gagal: ${lastStatus}. body: ${snippet}`)
}