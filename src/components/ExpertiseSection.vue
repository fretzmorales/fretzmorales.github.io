<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap, MQ } from '../composables/useGsap'
import { revealText, inView } from '../composables/useReveal'
import { skillGroups } from '../data/skills'
import SplitText from './SplitText.vue'

const root = ref(null)
let mm

onMounted(() => {
  mm = gsap.matchMedia(root.value)
  mm.add(MQ.motionOk, () => {
    revealText(root.value.querySelector('.exp__title .split'), { scrollTrigger: inView('.exp__title', { start: 'top 90%' }) })
    gsap.from('.exp__row', { opacity: 0, y: 60, stagger: 0.12, duration: 1.1, ease: 'expo.out', scrollTrigger: inView('.exp__rows', { start: 'top 85%' }) })
    gsap.from('.exp__line', { scaleX: 0, transformOrigin: 'left', stagger: 0.12, duration: 1.4, ease: 'expo.out', scrollTrigger: inView('.exp__rows', { start: 'top 85%' }) })
  })

  // Skill lists drift horizontally with scroll (desktop only), alternating direction
  mm.add(`${MQ.desktop} and ${MQ.motionOk}`, () => {
    root.value.querySelectorAll('.exp__list').forEach((ul, i) => {
      const dist = () => Math.max(0, ul.scrollWidth - ul.parentElement.clientWidth)
      const dir = i % 2 ? 1 : -1
      gsap.fromTo(ul, { x: () => (dir < 0 ? 0 : -dist()) }, {
        x: () => (dir < 0 ? -dist() : 0), ease: 'none',
        scrollTrigger: { trigger: ul.closest('.exp__row'), start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
      })
    })
    root.value.classList.add('is-drift')
    return () => root.value.classList.remove('is-drift')
  })
})

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="expertise" ref="root" class="exp section" aria-labelledby="exp-title">
    <header class="exp__head">
      <p class="eyebrow">03 / Expertise</p>
      <h2 id="exp-title" class="exp__title display" aria-label="Expertise"><SplitText text="Expertise" aria-hidden="true" /></h2>
    </header>

    <div class="exp__rows">
      <article v-for="(g, gi) in skillGroups" :key="g.id" class="exp__row" :aria-labelledby="`g-${g.id}`">
        <span class="exp__line" aria-hidden="true" />
        <div class="exp__top">
          <span class="exp__idx">0{{ gi + 1 }}</span>
          <h3 :id="`g-${g.id}`" class="exp__label display">{{ g.label }}</h3>
          <span class="exp__note">{{ g.note }} <b>{{ String(g.items.length).padStart(2, '0') }}</b></span>
        </div>
        <div class="exp__viewport">
          <ul class="exp__list">
            <li v-for="s in g.items" :key="s" class="display">{{ s }}</li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.exp {
  background: var(--bg-2); overflow: hidden;
  &__head { margin-bottom: clamp(3rem, 8vw, 7rem); display: grid; gap: 1.5rem; }
  &__title { font-size: clamp(4.5rem, 19vw, 24rem); }

  &__row { position: relative; padding: 1.75rem 0 clamp(2rem, 4vw, 3.5rem); transition: background 0.5s;
    &:hover .exp__label { color: var(--accent); transform: translateX(1.2rem); }
    &:hover .exp__idx { color: var(--accent); }
    &:hover .exp__list li { opacity: 1; }
  }
  &__line { position: absolute; top: 0; left: 0; width: 100%; height: 1px; background: var(--line); }

  &__top { display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1.25rem; align-items: baseline; margin-bottom: 1.5rem;
    @include desktop { grid-template-columns: 4rem 1fr auto; }
  }
  &__idx { font-size: 0.8rem; letter-spacing: 0.2em; color: var(--muted); transition: color 0.4s; }
  &__label { font-size: clamp(2.2rem, 7.2vw, 8rem); transition: color 0.5s, transform 0.7s var(--ease-out); }
  &__note { grid-column: 2; color: var(--muted); font-size: 0.85rem; b { color: var(--accent); margin-left: 0.5rem; } @include desktop { grid-column: auto; } }

  // Padding keeps the tall outlined glyphs (tight line-height + stroke) from being clipped; the negative margin cancels the extra space.
  &__viewport { overflow: hidden; padding-block: 0.9rem; margin-block: -0.9rem; }
  &__list { display: flex; flex-wrap: wrap; gap: 0.5rem 1.6rem;
    li { font-size: clamp(1.3rem, 3.4vw, 2.2rem); color: var(--text); opacity: 0.75; transition: color 0.3s, opacity 0.3s, transform 0.5s var(--ease-out);
      &:hover { color: var(--accent); transform: translateY(-4px); opacity: 1; }
      &:not(:last-child)::after { content: '✦'; margin-left: 1.6rem; color: var(--accent); font-size: 0.55em; vertical-align: middle; opacity: 0.8; } }
  }
}

// Drift mode: single line, wider than the viewport
.exp.is-drift .exp__list { flex-wrap: nowrap; width: max-content; gap: 0 2.5rem;
  li { white-space: nowrap; font-size: clamp(2.5rem, 4.6vw, 5.5rem); -webkit-text-stroke: 2.4px var(--text); paint-order: stroke fill; color: var(--bg-2); opacity: 1;
    &:hover { color: var(--accent); -webkit-text-stroke-color: var(--accent); }
    &:not(:last-child)::after { margin-left: 2.5rem; } }
}
</style>
