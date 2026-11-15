// Generates public/og-image.jpg (1200×630) from the running preview server.
import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const p = await b.newPage()
await p.setViewport({ width: 1200, height: 630 })
await p.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 5000))
await p.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 85 })
await b.close()
