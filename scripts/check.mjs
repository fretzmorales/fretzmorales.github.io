// Visual smoke test: node scripts/check.mjs <outDir>
import puppeteer from 'puppeteer-core'
const out = process.argv[2]
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const sizes = [[1440, 900, 'd'], [390, 844, 'm']]
for (const [w, h, tag] of sizes) {
  const page = await browser.newPage()
  const errs = []
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && errs.push(m.type() + ': ' + m.text()))
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message))
  await page.setViewport({ width: w, height: h, isMobile: tag === 'm', hasTouch: tag === 'm' })
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 5000))
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  console.log(tag, 'height', total, 'hOverflow', overflow)
  const steps = tag === 'd' ? 14 : 10
  for (let i = 0; i <= steps; i++) {
    const y = Math.round(((total - h) * i) / steps)
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await new Promise((r) => setTimeout(r, 1800))
    await page.screenshot({ path: `${out}/${tag}-${String(i).padStart(2, '0')}.png` })
  }
  console.log(tag, 'errors:', errs.length ? errs : 'none')
  await page.close()
}
await browser.close()
