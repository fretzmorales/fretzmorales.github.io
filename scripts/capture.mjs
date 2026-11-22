// Captures desktop screenshots of the live project sites into public/w (webp).
// Usage: node scripts/capture.mjs
import puppeteer from 'puppeteer-core'
const sites = [
  ['mrrac', 'https://mrrac.au/'],
  ['connoley', 'https://connoleybuildinggroup.com.au/'],
  ['ims', 'https://imsgptyltd.com/'],
  ['deckheads', 'https://deckheads-tas.com.au/'],
  ['precise', 'https://preciseacreagesolutions.com.au/'],
  ['hubhound', 'https://hubhound.com/'],
  ['kava', 'https://kavadigital.com.au/'],
  ['intellectrical', 'https://intellectrical.com.au/'],
  ['4gp', 'https://4gp.com.au/'],
]
// Optional: pass slugs to capture only those (node scripts/capture.mjs kava 4gp)
const only = process.argv.slice(2)
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})
for (const [slug, url] of sites) {
  if (only.length && !only.includes(slug)) continue
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })
    await new Promise((r) => setTimeout(r, 2500))
    // dismiss cookie banners so they don't end up in the screenshot
    const btn = await page.evaluateHandle(() => {
      // search shadow roots too (some consent widgets render inside one)
      const buttons = []
      const walk = (root) => root.querySelectorAll('*').forEach((e) => {
        if (e.tagName === 'BUTTON') buttons.push(e)
        if (e.shadowRoot) walk(e.shadowRoot)
      })
      walk(document)
      return buttons.find((x) => /^(decline|reject|deny)/i.test(x.textContent.trim())) || null
    })
    // real mouse click: some consent widgets ignore synthetic el.click()
    await btn.asElement()?.click()
    await new Promise((r) => setTimeout(r, 1200))
    // fallback: if a consent widget is still showing, remove its shadow-DOM host so it stays out of the shot
    await page.evaluate(() => {
      document.querySelectorAll('*').forEach((e) => {
        if (e.shadowRoot && /cookie/i.test(e.shadowRoot.textContent || '')) e.remove()
      })
    })
    await page.screenshot({ path: `public/w/${slug}.webp`, type: 'webp', quality: 82 })
    console.log('ok', slug)
  } catch (e) {
    console.log('FAIL', slug, e.message)
  }
  await page.close()
}
await browser.close()
