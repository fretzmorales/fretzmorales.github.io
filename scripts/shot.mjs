import puppeteer from 'puppeteer-core'
const [w, h, sel, out] = [+process.argv[2], +process.argv[3], process.argv[4], process.argv[5]]
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const p = await b.newPage(); await p.setViewport({ width: w, height: h })
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 5000))
const y = await p.evaluate(() => { const s = document.querySelector('#works'); const top = s.getBoundingClientRect().top + scrollY; return top + (document.querySelector('.works__track').scrollWidth - innerWidth) * 0.78 })
await p.evaluate(y => scrollTo(0, y), y); await new Promise(r => setTimeout(r, 3000))
await p.screenshot({ path: out }); await b.close()
