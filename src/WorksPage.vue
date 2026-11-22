<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { ArrowLeft, ArrowUpRight } from 'lucide-vue-next'
import { gsap } from './composables/useGsap'
import { site } from './data/site'

// Fetched at runtime from /w/ (blocked from crawlers), same as the home page showcase.
const projects = ref([])
const failed = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('/w/projects.json')
    if (!res.ok) throw new Error(String(res.status))
    projects.value = await res.json()
  } catch {
    failed.value = true
    return
  }
  await nextTick()
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.from('.wp__line > span', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.08 })
  gsap.from('.wp__lead, .wp__count', { opacity: 0, y: 20, duration: 1, delay: 0.4, ease: 'power3.out' })
  gsap.from('.card', { opacity: 0, y: 60, duration: 1.1, ease: 'expo.out', stagger: 0.12, delay: 0.5 })
})
</script>

<template>
  <div class="grain" aria-hidden="true" />
  <header class="wp__nav">
    <a class="wp__back" href="/#works"><ArrowLeft :size="16" aria-hidden="true" /> Back to portfolio</a>
    <a class="wp__logo" href="/"><span aria-hidden="true">✳</span> {{ site.name }}</a>
  </header>

  <main class="wp">
    <section class="wp__head">
      <p class="eyebrow">Archive</p>
      <h1 class="wp__title display" aria-label="All Works">
        <span class="wp__line" aria-hidden="true"><span>All</span></span>
        <span class="wp__line outline" aria-hidden="true"><span>Works</span></span>
      </h1>
      <p class="wp__lead">Every website I have developed, built with WordPress and a focus on clean, responsive front ends.</p>
      <p v-if="projects.length" class="wp__count"><b>{{ String(projects.length).padStart(2, '0') }}</b> Projects</p>
    </section>

    <p v-if="failed" class="wp__empty">Works could not be loaded. Please refresh the page.</p>

    <ul class="wp__grid" data-nosnippet>
      <li v-for="p in projects" :key="p.id" class="card">
        <a class="card__shot" :href="p.url" target="_blank" rel="noopener noreferrer" :aria-label="`Visit ${p.name} (opens in a new tab)`">
          <span class="card__bar" aria-hidden="true"><i /><i /><i /><em>{{ p.host }}</em></span>
          <span class="card__clip">
            <img :src="p.image" :alt="`Screenshot of the ${p.name} website`" width="1440" height="900" loading="lazy" decoding="async" />
          </span>
          <span class="card__visit" aria-hidden="true">Visit <ArrowUpRight :size="18" /></span>
        </a>
        <div class="card__body">
          <span class="card__num display" aria-hidden="true">{{ p.number }}</span>
          <div>
            <h2 class="card__title display">{{ p.name }}</h2>
            <p class="card__cat">{{ p.category }}</p>
            <ul class="card__role" aria-label="My role">
              <li v-for="r in p.role" :key="r">{{ r }}</li>
            </ul>
          </div>
        </div>
      </li>
    </ul>

    <section class="wp__cta">
      <p class="display">Have a project<br /><span class="accent">in mind?</span></p>
      <a class="link-arrow" :href="`mailto:${site.email}`">Start a project <ArrowUpRight :size="16" aria-hidden="true" /></a>
    </section>
  </main>

  <footer class="wp__foot">© {{ new Date().getFullYear() }} {{ site.name }} — {{ site.location }}</footer>
</template>

<style lang="scss" scoped>
@use './styles/tokens' as *;

.wp {
  padding: clamp(7rem, 14vw, 11rem) var(--gutter) clamp(4rem, 8vw, 7rem);
  max-width: 1500px; margin: 0 auto;

  &__nav { position: fixed; inset: 0 0 auto; z-index: 50; display: flex; justify-content: space-between; align-items: center; padding: 1.2rem var(--gutter); mix-blend-mode: difference; color: #fff; font-size: 0.78rem; letter-spacing: 0.16em; text-transform: uppercase; }
  &__back { display: inline-flex; align-items: center; gap: 0.6rem; svg { transition: transform 0.4s var(--ease-out); } &:hover svg { transform: translateX(-4px); } }
  &__logo { font-weight: 700; span { margin-right: 0.4rem; } }

  &__head { display: grid; gap: 1.5rem; justify-items: start; padding-bottom: clamp(3rem, 7vw, 6rem); border-bottom: 1px solid var(--line); margin-bottom: clamp(3rem, 7vw, 6rem); position: relative; }
  &__title { font-size: clamp(5rem, 22vw, 15rem); }
  &__line { display: block; overflow: hidden; padding-block: 0.06em; margin-block: -0.06em; > span { display: block; } }
  &__lead { color: var(--muted); max-width: 42ch; font-size: 1.05rem; }
  &__count { color: var(--muted); font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; b { color: var(--accent); font-size: 1.1rem; margin-right: 0.4rem; } @include desktop { position: absolute; right: 0; bottom: clamp(3rem, 7vw, 6rem); } }
  &__empty { color: var(--muted); padding: 2rem 0; }

  &__grid { display: grid; gap: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 3vw, 3rem); grid-template-columns: 1fr; @include desktop { grid-template-columns: repeat(2, minmax(0, 1fr)); > li:nth-child(even) { margin-top: 6rem; } } }

  &__cta { margin-top: clamp(6rem, 12vw, 10rem); display: grid; gap: 1.5rem; justify-items: start; p { font-size: clamp(3.5rem, 12vw, 8rem); } }
  &__foot { padding: 2rem var(--gutter); border-top: 1px solid var(--line); color: var(--muted); font-size: 0.78rem; letter-spacing: 0.1em; text-align: center; }
}

.card {
  &__shot { position: relative; display: block; background: var(--bg-2); border: 1px solid var(--line); overflow: hidden; transition: border-color 0.5s; &:hover, &:focus-visible { border-color: var(--accent); } }
  &__bar { display: flex; align-items: center; gap: 6px; height: 2rem; padding: 0 0.9rem; background: #151515; border-bottom: 1px solid var(--line);
    i { width: 8px; height: 8px; border-radius: 50%; background: #333; } em { margin-left: 0.8rem; font-style: normal; font-size: 0.7rem; letter-spacing: 0.1em; color: var(--muted); } }
  &__clip { display: block; aspect-ratio: 16/10; overflow: hidden; }
  &__clip img { width: 100%; height: 100%; object-fit: cover; object-position: top; filter: grayscale(0.9) contrast(1.05); transform: scale(1.02); transition: filter 0.7s, transform 1.2s var(--ease-out); }
  &__shot:hover img, &__shot:focus-visible img { filter: none; transform: scale(1.06); }
  &__visit { position: absolute; right: 1rem; bottom: 1rem; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.55rem 0.9rem; background: var(--accent); color: var(--ink); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0; transform: translateY(10px); transition: opacity 0.4s, transform 0.5s var(--ease-out); }
  &__shot:hover &__visit, &__shot:focus-visible &__visit { opacity: 1; transform: none; }
  @media (hover: none) { &__visit { opacity: 1; transform: none; } }

  &__body { display: grid; grid-template-columns: auto 1fr; gap: 1.2rem; padding-top: 1.5rem; }
  &__num { font-size: 2.2rem; color: var(--accent); line-height: 1; }
  &__title { font-size: clamp(1.9rem, 3.6vw, 2.8rem); line-height: 1; }
  &__cat { margin-top: 0.7rem; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); }
  &__role { display: grid; gap: 0.3rem; margin-top: 1rem; color: rgba(245, 245, 240, 0.78); font-size: 0.92rem;
    li { padding-left: 1.1rem; position: relative; &::before { content: ''; position: absolute; left: 0; top: 0.7em; width: 0.5rem; height: 1px; background: var(--accent); } } }
}
</style>
