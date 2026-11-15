// Captures desktop screenshots of the live project sites into public/w (webp).
// Usage: node scripts/capture.mjs
import puppeteer from 'puppeteer-core'
const sites = [
  ['mrrac', 'https://mrrac.au/'],
  ['connoley', 'https://connoleybuildinggroup.com.au/'],
  ['ims', 'https://imsgptyltd.com/'],
]
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})
for (const [slug, url] of sites) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })
    await new Promise((r) => setTimeout(r, 2500))
    // dismiss cookie banners so they don't end up in the screenshot
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => /decline|reject/i.test(x.textContent))
      b && b.click()
    })
    await new Promise((r) => setTimeout(r, 1200))
    await page.screenshot({ path: `public/w/${slug}.webp`, type: 'webp', quality: 82 })
    console.log('ok', slug)
  } catch (e) {
    console.log('FAIL', slug, e.message)
  }
  await page.close()
}
await browser.close()
