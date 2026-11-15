import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 5000))
await p.screenshot({ path: process.argv[2], clip: { x: 200, y: 340, width: 800, height: 260 } }); await b.close()
