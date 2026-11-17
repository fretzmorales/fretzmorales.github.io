// Central site configuration. Replace the placeholder values marked TODO.
export const site = {
  // ── Search visibility ────────────────────────────────────────────────
  // Single source of truth. Keep `true` while building. Launch = a deliberate edit to `false`.
  // Only an explicit `false` allows indexing; any other value is treated as blocked.
  discourageSearchEngines: true,
  productionBranch: 'main', // Cloudflare Pages branches other than this are never indexable

  // ── Identity (TODO: replace placeholders) ────────────────────────────
  name: 'nfmorales',
  role: 'WordPress & Frontend Developer',
  location: 'Philippines',
  email: 'moralesnoliefretz@gmail.com',
  linkedin: 'https://www.linkedin.com/in/noliefretz/',
  url: 'https://fretzmorales.github.io', // production URL (used for Open Graph)

  title: 'nfmorales — WordPress & Frontend Developer',
  description:
    'Independent WordPress and Frontend Developer from the Philippines building thoughtful, functional and visually engaging websites.',
}

// Pages that stay noindex even after launch (thank-you / confirmation / 404 landings).
export const alwaysNoindexPaths = ['/404', '/thank-you', '/thank-you-booking', '/thank-you-hmdg']

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'works', label: 'Works' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]
