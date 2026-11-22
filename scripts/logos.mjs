// Downloads each client's header logo into public/w/logos. Usage: node scripts/logos.mjs [slug...]
import puppeteer from 'puppeteer-core'
import { writeFile } from 'node:fs/promises'
import { extname } from 'node:path'
const sites = {
  photoup: 'https://www.photoup.net/', tradiedevelopers: 'https://tradiedevelopers.com.au/', acxhub: 'https://www.acxhub.com/',
}
const only = process.argv.slice(2)
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
for (const [slug, url] of Object.entries(sites)) {
  if (only.length && !only.includes(slug)) continue
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })
    await new Promise((r) => setTimeout(r, 2000))
    const src = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')].filter((i) => i.getBoundingClientRect().top < 220 && i.getBoundingClientRect().width > 30)
      const score = (i) => (/logo/i.test(i.src + i.alt + i.className + (i.closest('a')?.className || '')) ? 2 : 0) + (i.closest('header,nav') ? 1 : 0)
      imgs.sort((a, b) => score(b) - score(a))
      return imgs[0]?.currentSrc || imgs[0]?.src || null
    })
    if (!src) { console.log('NONE', slug); continue }
    const res = await fetch(src)
    const ext = (extname(new URL(src).pathname) || '.png').toLowerCase()
    await writeFile(`public/w/logos/${slug}${ext}`, Buffer.from(await res.arrayBuffer()))
    console.log('ok', slug, src)
  } catch (e) { console.log('FAIL', slug, e.message) }
  await page.close()
}
await browser.close()
