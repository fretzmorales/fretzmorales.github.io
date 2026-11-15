<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap, MQ } from '../composables/useGsap'
import { revealText, inView } from '../composables/useReveal'
import { experience } from '../data/experience'
import SplitText from './SplitText.vue'

const root = ref(null)
let mm

onMounted(() => {
  mm = gsap.matchMedia(root.value)
  mm.add(MQ.motionOk, () => {
    revealText(root.value.querySelector('.xp__title .split'), { scrollTrigger: inView('.xp__title', { start: 'top 90%' }) })

    gsap.fromTo('.xp__rail-fill', { scaleY: 0 }, {
      scaleY: 1, ease: 'none', transformOrigin: 'top',
      scrollTrigger: { trigger: '.xp__list', start: 'top 60%', end: 'bottom 60%', scrub: true },
    })

    root.value.querySelectorAll('.xp__item').forEach((item) => {
      // outline → filled sweep, scrubbed
      gsap.fromTo(item.querySelector('.xp__fill'), { clipPath: 'inset(0 100% 0 0)' }, {
        clipPath: 'inset(0 0% 0 0)', ease: 'none',
        scrollTrigger: { trigger: item, start: 'top 75%', end: 'top 20%', scrub: true },
      })
      gsap.from(item.querySelector('.xp__dot'), { scale: 0, duration: 0.8, ease: 'back.out(3)', scrollTrigger: inView(item, { start: 'top 70%' }) })
      gsap.from(item.querySelectorAll('.xp__meta > *'), { opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: inView(item, { start: 'top 65%' }) })
      gsap.from(item.querySelectorAll('.xp__points li'), { opacity: 0, x: 30, stagger: 0.07, duration: 0.9, ease: 'power3.out', scrollTrigger: inView(item.querySelector('.xp__points'), { start: 'top 88%' }) })
    })
  })
})

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="experience" ref="root" class="xp section" aria-labelledby="xp-title">
    <header class="xp__head">
      <p class="eyebrow">04 / Experience</p>
      <h2 id="xp-title" class="xp__title display" aria-label="Experience"><SplitText text="Experience" aria-hidden="true" /></h2>
    </header>

    <ol class="xp__list">
      <span class="xp__rail" aria-hidden="true"><i class="xp__rail-fill" /></span>
      <li v-for="e in experience" :key="e.id" class="xp__item">
        <span class="xp__dot" aria-hidden="true" />
        <div class="xp__date display" aria-hidden="true">
          <span class="xp__outline outline">{{ e.from }} — {{ e.to }}</span>
          <span class="xp__fill accent">{{ e.from }} — {{ e.to }}</span>
        </div>
        <div class="xp__body">
          <div class="xp__meta">
            <p class="xp__range">{{ e.range }}</p>
            <h3 class="xp__role display">{{ e.title }}</h3>
            <p class="xp__company">{{ e.company }}</p>
          </div>
          <ul class="xp__points">
            <li v-for="p in e.points" :key="p">{{ p }}</li>
          </ul>
        </div>
      </li>
    </ol>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.xp {
  &__head { display: grid; gap: 1.5rem; margin-bottom: clamp(3rem, 8vw, 7rem); }
  &__title { font-size: clamp(3.6rem, 15vw, 19rem); }

  &__list { position: relative; display: grid; gap: clamp(5rem, 11vw, 10rem); padding-left: clamp(1.5rem, 4vw, 4rem); }
  &__rail { position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: var(--line); }
  &__rail-fill { display: block; width: 100%; height: 100%; background: var(--accent); }
  &__dot { position: absolute; left: calc(-1 * clamp(1.5rem, 4vw, 4rem) - 5px); top: 1.2rem; width: 11px; height: 11px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 6px rgba(198, 255, 0, 0.15); }

  &__item { position: relative; display: grid; gap: 2rem; }
  &__date { position: relative; width: fit-content; font-size: clamp(3.8rem, 13vw, 15rem); white-space: nowrap; }
  &__fill { position: absolute; inset: 0; }

  &__body { display: grid; gap: 2rem; @include desktop { grid-template-columns: 5fr 6fr; gap: 6vw; } }
  &__meta { display: grid; gap: 0.6rem; align-content: start; }
  &__range { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); }
  &__role { font-size: clamp(2rem, 4.2vw, 4.2rem); line-height: 0.98; }
  &__company { color: var(--muted); font-size: 1.05rem; }

  &__points { display: grid; gap: 0; border-top: 1px solid var(--line);
    li { padding: 0.9rem 0; border-bottom: 1px solid var(--line); display: flex; gap: 1rem; transition: color 0.3s, padding 0.5s var(--ease-out); color: rgba(245, 245, 240, 0.85);
      &::before { content: '→'; color: var(--accent); flex: none; }
      &:hover { color: var(--accent); padding-left: 0.6rem; } }
  }
}
</style>
