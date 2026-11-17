<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap, MQ } from '../composables/useGsap'
import { revealText, inView } from '../composables/useReveal'
import SplitText from './SplitText.vue'
import portrait from '../assets/images/portrait.svg'

const root = ref(null)
let mm

const paragraphs = [
  "I'm a developer with a passion for building websites that combine functionality, performance, and thoughtful design.",
  'With experience in frontend development and WordPress development, I work across the entire process — from designing and developing responsive interfaces to maintaining, optimizing, and improving existing websites.',
  'I enjoy transforming ideas and designs into functional digital experiences using modern frontend technologies and powerful WordPress tools.',
].map((p) => p.split(' '))

const stats = [
  { n: 12, suffix: '+', label: 'Years of professional frontend development' },
  { n: 10, suffix: '+', label: 'Years of WordPress development' },
  { text: 'Intl.', label: 'Experience working with international clients' },
  { text: 'WP', label: 'Focus on WordPress, Elementor, and frontend development' },
]

onMounted(() => {
  mm = gsap.matchMedia(root.value)

  mm.add(MQ.motionOk, () => {
    // headline lines
    root.value.querySelectorAll('.about__h .split').forEach((el) => revealText(el, { scrollTrigger: inView(el, { start: 'top 90%' }) }))
    gsap.from('.about__label', { opacity: 0, y: 20, scrollTrigger: inView('.about__label') })

    // clip-path reveal + layered parallax for imagery
    gsap.from('.about__img', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.out', scrollTrigger: inView('.about__figure', { start: 'top 80%' }) })
    gsap.from('.about__img img', { scale: 1.4, duration: 2, ease: 'expo.out', scrollTrigger: inView('.about__figure', { start: 'top 80%' }) })
    gsap.to('.about__img img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.about__figure', start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.to('.about__frame', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.about__figure', start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.to('.about__tag', { yPercent: -45, ease: 'none', scrollTrigger: { trigger: '.about__figure', start: 'top bottom', end: 'bottom top', scrub: true } })

    // large type at different speeds
    gsap.to('.about__ghost', { xPercent: -28, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true } })
    ;[-6, 4, -2].forEach((x, i) =>
      gsap.to(`.about__h-line:nth-child(${i + 1})`, { xPercent: x * 2, ease: 'none', scrollTrigger: { trigger: '.about__h', start: 'top 90%', end: 'bottom 20%', scrub: true } }))

    // word-by-word highlight
    root.value.querySelectorAll('.about__p').forEach((p) => {
      gsap.fromTo(p.querySelectorAll('.w'), { opacity: 0.16 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 55%', scrub: true },
      })
    })

    // stats
    gsap.from('.about__stat', { opacity: 0, y: 50, stagger: 0.12, duration: 1.1, ease: 'expo.out', scrollTrigger: inView('.about__stats', { start: 'top 88%' }) })
    root.value.querySelectorAll('[data-count]').forEach((el) => {
      const o = { v: 0 }
      gsap.to(o, { v: +el.dataset.count, duration: 1.8, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v)), scrollTrigger: inView('.about__stats', { start: 'top 88%' }) })
    })
  })
})

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="about" ref="root" class="about section" aria-labelledby="about-title">
    <div class="about__ghost display outline" aria-hidden="true">About — About — About</div>

    <p class="about__label eyebrow">01 / About</p>

    <h2 id="about-title" class="about__h display" aria-label="Function. Performance. Design.">
      <span class="about__h-line" aria-hidden="true"><SplitText text="Function." /></span>
      <span class="about__h-line about__h-line--2" aria-hidden="true"><SplitText class="outline" text="Performance." /></span>
      <span class="about__h-line about__h-line--3" aria-hidden="true"><SplitText text="Design" /><span class="accent">.</span></span>
    </h2>

    <div class="about__body">
      <figure class="about__figure">
        <div class="about__frame" aria-hidden="true" />
        <div class="about__img">
          <img :src="portrait" alt="Portrait placeholder — replace with your photo" width="800" height="1000" loading="lazy" decoding="async" />
        </div>
        <figcaption class="about__tag">Based in the Philippines — working worldwide</figcaption>
      </figure>

      <div class="about__text">
        <p v-for="(words, i) in paragraphs" :key="i" class="about__p" :class="{ 'about__p--lead': i === 0 }">
          <template v-for="(w, j) in words" :key="j"><span class="w">{{ w }}</span>{{ ' ' }}</template>
        </p>
      </div>
    </div>

    <ul class="about__stats">
      <li v-for="(s, i) in stats" :key="i" class="about__stat">
        <span class="about__num display">
          <template v-if="s.n"><span :data-count="s.n">{{ s.n }}</span><em>{{ s.suffix }}</em></template>
          <template v-else>{{ s.text }}</template>
        </span>
        <span class="about__stat-label">{{ s.label }}</span>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.about {
  overflow: hidden; background: var(--bg);
  &__ghost { position: absolute; top: 4%; left: 0; font-size: clamp(10rem, 34vw, 40rem); white-space: nowrap; opacity: 0.18; pointer-events: none; -webkit-text-stroke: 3px var(--line); }
  &__label { position: relative; margin-bottom: 2rem; }
  &__h { position: relative; font-size: clamp(3.4rem, 12.5vw, 17rem); margin-bottom: clamp(3rem, 8vw, 7rem); }
  &__h-line { display: block; width: fit-content; &--2 { margin-left: clamp(0rem, 18vw, 26rem); } &--3 { margin-left: clamp(0rem, 6vw, 9rem); } }

  &__body { position: relative; display: grid; gap: 3rem; align-items: start; @include desktop { grid-template-columns: 5fr 7fr; gap: 6vw; } }
  &__figure { position: relative; width: min(100%, 460px); @include desktop { margin-top: 6vw; } }
  &__img { position: relative; overflow: hidden; aspect-ratio: 4/5; background: var(--bg-2); img { width: 100%; height: 118%; object-fit: cover; } }
  &__frame { position: absolute; inset: 0; transform: translate(1.5rem, 1.5rem); border: 1px solid var(--accent); z-index: -1; }
  &__tag { position: absolute; right: -1rem; bottom: 2rem; max-width: 12rem; padding: 0.75rem 1rem; background: var(--accent); color: var(--ink); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; line-height: 1.35; @include below-tablet { right: 0; } }

  &__text { display: grid; gap: 2rem; max-width: 46rem; }
  &__p { font-size: clamp(1.1rem, 1.6vw, 1.45rem); line-height: 1.55;
    &--lead { font-family: var(--font-display); text-transform: uppercase; font-size: clamp(1.8rem, 3.6vw, 3.6rem); line-height: 1.05; }
  }

  &__stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.5rem 1.5rem; margin-top: clamp(4rem, 9vw, 8rem); padding-top: 2rem; border-top: 1px solid var(--line); @include desktop { grid-template-columns: repeat(4, 1fr); } }
  &__stat { display: grid; gap: 0.75rem; align-content: start; &:nth-child(even) { @include desktop { margin-top: 3rem; } } }
  &__num { font-size: clamp(3.5rem, 8vw, 8rem); em { font-style: normal; color: var(--accent); } }
  &__stat-label { max-width: 20ch; color: var(--muted); font-size: 0.85rem; line-height: 1.4; }
}
</style>
