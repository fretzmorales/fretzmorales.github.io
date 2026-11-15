import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { site, alwaysNoindexPaths } from './src/data/site.js'

/**
 * Search-engine visibility (HMDG rule: hidden by default).
 * Indexing is allowed ONLY when site.discourageSearchEngines is explicitly `false`
 * (a deliberate launch edit in src/data/site.js) AND this is not a preview/staging build.
 * Anything else — true, missing, null, undefined — fails safe to blocked.
 */
const isPreviewBuild =
  process.env.CF_PAGES === '1' && process.env.CF_PAGES_BRANCH !== site.productionBranch
const blocked = site.discourageSearchEngines !== false || isPreviewBuild

const robotsTxt = blocked
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n${alwaysNoindexPaths.map((p) => `Disallow: ${p}`).join('\n')}\n`

const headersFile = [
  blocked ? '/*\n  X-Robots-Tag: noindex, nofollow\n' : '',
  '/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n',
]
  .filter(Boolean)
  .join('\n')

function visibilityPlugin() {
  const robotsMeta = blocked
    ? '<meta name="robots" content="noindex, nofollow" />'
    : '<meta name="robots" content="index, follow" />'
  const canonical = blocked ? '' : `<link rel="canonical" href="${site.url}/" />`
  const serve = (server) => {
    server.middlewares.use((req, res, next) => {
      if (blocked) res.setHeader('X-Robots-Tag', 'noindex, nofollow')
      if (req.url === '/robots.txt') {
        res.setHeader('Content-Type', 'text/plain')
        return res.end(robotsTxt)
      }
      next()
    })
  }
  return {
    name: 'site-visibility',
    transformIndexHtml: (html) =>
      html
        .replace('<!--ROBOTS-->', robotsMeta)
        .replace('<!--CANONICAL-->', canonical)
        .replaceAll('%SITE_URL%', site.url),
    configureServer: serve,
    configurePreviewServer: serve,
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt })
      this.emitFile({ type: 'asset', fileName: '_headers', source: headersFile })
    },
  }
}

export default defineConfig({
  plugins: [vue(), visibilityPlugin()],
  css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
  build: { chunkSizeWarningLimit: 700 },
})
