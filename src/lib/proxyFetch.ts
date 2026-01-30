/**
 * Proxy Fetch pakai ScraperAPI (stabil)
 */

export async function proxyFetchHTML(url: string): Promise<string> {
  const apiKey = process.env.SCRAPERAPI_KEY

  if (!apiKey) {
    throw new Error("SCRAPERAPI_KEY belum diset di ENV")
  }

  // ScraperAPI endpoint
  const proxyUrl = `https://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(
    url
  )}`

  console.log("⚡ SCRAPERAPI FETCH:", proxyUrl)

  const res = await fetch(proxyUrl, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`ScraperAPI gagal: ${res.status}`)
  }

  const html = await res.text()

  if (!html || html.length < 200) {
    throw new Error("HTML kosong dari ScraperAPI")
  }

  return html
}