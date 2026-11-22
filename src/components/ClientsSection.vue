<script setup>
import { onMounted, ref } from 'vue'
import { gsap, MQ } from '../composables/useGsap'
import { inView } from '../composables/useReveal'
import { ArrowUpRight } from 'lucide-vue-next'

const root = ref(null)
// Logos live in /w/ (blocked from crawlers), same as the Works assets.
const companies = [
  { id: 'photoup', name: 'PhotoUp Philippines Corporation', url: 'https://www.photoup.net/', logo: '/w/logos/photoup.png', w: 122, h: 35 },
  { id: 'tradiedevelopers', name: 'TradieDevelopers', url: 'https://tradiedevelopers.com.au/', logo: '/w/logos/tradiedevelopers.svg', w: 200, h: 60 },
]

onMounted(() => {
  gsap.matchMedia(root.value).add(MQ.motionOk, () => {
    gsap.from(root.value.querySelectorAll('.clients__head > *, .clients__item'), {
      opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: inView(root.value, { start: 'top 80%' }),
    })
  })
})
</script>

<template>
  <section id="clients" ref="root" class="clients" aria-labelledby="clients-title" data-nosnippet>
    <div class="clients__head">
      <p class="eyebrow">Companies</p>
      <h2 id="clients-title" class="clients__title">Companies I've worked with</h2>
    </div>

    <ul class="clients__list">
      <li v-for="c in companies" :key="c.id" class="clients__item">
        <a :href="c.url" target="_blank" rel="noopener noreferrer" :aria-label="`${c.name} (opens in a new tab)`" data-cursor="Visit">
          <img :src="c.logo" :alt="`${c.name} logo`" :width="c.w" :height="c.h" loading="lazy" decoding="async" />
          <ArrowUpRight class="clients__arrow" :size="18" aria-hidden="true" />
        </a>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.clients {
  position: relative; background: var(--bg); padding: clamp(4rem, 9vw, 7rem) var(--gutter);
  border-block: 1px solid var(--line);

  &__head { display: grid; gap: 1rem; justify-items: start; margin-bottom: clamp(2.5rem, 5vw, 4rem); }
  &__title { font-family: var(--font-display); font-weight: 400; text-transform: uppercase; line-height: 0.95; font-size: clamp(2rem, 5vw, 3.6rem); max-width: 18ch; }

  &__list { display: grid; gap: 1px; background: var(--line); border: 1px solid var(--line); @include desktop { grid-template-columns: repeat(2, 1fr); } }
  &__item a { position: relative; display: flex; align-items: center; justify-content: center; height: clamp(9rem, 18vw, 13rem); background: var(--bg); padding: 2rem; transition: background 0.5s; &:hover, &:focus-visible { background: var(--bg-2); } }
  // One-colour treatment so the two logos match on the dark page.
  img { height: clamp(2.4rem, 4.5vw, 3.6rem); width: auto; max-width: 80%; object-fit: contain; filter: brightness(0) invert(1); opacity: 0.6; transition: opacity 0.4s; }
  &__item a:hover img, &__item a:focus-visible img { opacity: 1; }
  &__arrow { position: absolute; top: 1.2rem; right: 1.2rem; color: var(--accent); opacity: 0; transform: translate(-6px, 6px); transition: opacity 0.4s, transform 0.5s var(--ease-out); }
  &__item a:hover &__arrow, &__item a:focus-visible &__arrow { opacity: 1; transform: none; }
}
</style>
