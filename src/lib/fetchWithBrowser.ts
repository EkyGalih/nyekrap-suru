import puppeteer from "puppeteer"

/**
 * Fetch HTML pakai browser asli (anti-bot bypass)
 */
export async function fetchWithBrowser(url: string): Promise<string> {
  console.log("🌐 Puppeteer Fetch:", url)

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()

  // Header biar dianggap browser normal
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  )

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 30000,
  })

  const html = await page.content()

  await browser.close()

  if (!html || html.length < 200) {
    throw new Error("HTML kosong dari Puppeteer")
  }

  return html
}