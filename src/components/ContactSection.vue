<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { ArrowUpRight, Mail, Linkedin, Github, MapPin } from 'lucide-vue-next'
import { gsap, MQ } from '../composables/useGsap'
import { revealText, inView } from '../composables/useReveal'
import { site } from '../data/site'
import SplitText from './SplitText.vue'

const root = ref(null)
let mm

const links = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}`, icon: Mail },
  { label: 'LinkedIn', value: site.linkedin.replace(/^https?:\/\/(www\.)?/, ''), href: site.linkedin, icon: Linkedin, ext: true },
  { label: 'GitHub', value: site.github.replace(/^https?:\/\/(www\.)?/, ''), href: site.github, icon: Github, ext: true },
  { label: 'Location', value: site.location, icon: MapPin },
]

onMounted(() => {
  mm = gsap.matchMedia(root.value)
  mm.add(MQ.motionOk, () => {
    root.value.querySelectorAll('.contact__line').forEach((l, i) => revealText(l, { delay: i * 0.12, scrollTrigger: inView('.contact__title', { start: 'top 80%' }) }))
    gsap.from('.contact__lead, .contact__cta', { opacity: 0, y: 40, stagger: 0.15, duration: 1.2, ease: 'expo.out', scrollTrigger: inView('.contact__lead', { start: 'top 90%' }) })
    gsap.from('.contact__links li', { opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: inView('.contact__links', { start: 'top 92%' }) })

    const scrub = { trigger: root.value, start: 'top bottom', end: 'bottom bottom', scrub: true }
    gsap.fromTo('.contact__glow--a', { yPercent: -30 }, { yPercent: 30, ease: 'none', scrollTrigger: scrub })
    gsap.fromTo('.contact__glow--b', { yPercent: 40 }, { yPercent: -20, ease: 'none', scrollTrigger: scrub })
    gsap.fromTo('.contact__ring', { rotate: -40, scale: 0.8 }, { rotate: 60, scale: 1.1, ease: 'none', scrollTrigger: scrub })
    gsap.fromTo('.contact__title', { xPercent: -4 }, { xPercent: 2, ease: 'none', scrollTrigger: scrub })
  })
})

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="contact" ref="root" class="contact section" aria-labelledby="contact-title">
    <div class="contact__glow contact__glow--a" aria-hidden="true" />
    <div class="contact__glow contact__glow--b" aria-hidden="true" />
    <svg class="contact__ring" viewBox="0 0 400 400" aria-hidden="true">
      <circle cx="200" cy="200" r="198" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 10" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" stroke-width="1" />
      <path d="M200 2v50M200 348v50M2 200h50M348 200h50" stroke="currentColor" stroke-width="1" />
    </svg>

    <p class="eyebrow">05 / Contact</p>

    <h2 id="contact-title" class="contact__title display" aria-label="Let's build something extraordinary.">
      <span class="contact__line" aria-hidden="true"><SplitText text="Let's build" /></span>
      <span class="contact__line outline" aria-hidden="true"><SplitText text="something" /></span>
      <span class="contact__line" aria-hidden="true"><SplitText text="extraordinary." /></span>
    </h2>

    <div class="contact__row">
      <p class="contact__lead">Have a project, an idea, or an opportunity? Let's create something meaningful together.</p>

      <a v-magnetic="0.3" class="contact__cta" :href="`mailto:${site.email}`" data-cursor="Email">
        <span class="contact__cta-fill" aria-hidden="true" />
        <span class="contact__cta-text">Say hello <ArrowUpRight :size="22" aria-hidden="true" /></span>
      </a>
    </div>

    <ul class="contact__links">
      <li v-for="l in links" :key="l.label">
        <component :is="l.href ? 'a' : 'div'" :href="l.href" :target="l.ext ? '_blank' : undefined" :rel="l.ext ? 'noopener noreferrer' : undefined" class="contact__link">
          <component :is="l.icon" :size="18" aria-hidden="true" />
          <span class="contact__link-label">{{ l.label }}</span>
          <span class="contact__link-value">{{ l.value }}</span>
        </component>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.contact {
  min-height: 100svh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 2rem; isolation: isolate;
  background: var(--bg);
  &::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 22vh; z-index: -1; background: linear-gradient(to bottom, transparent, #050505); }

  &__glow { position: absolute; z-index: -2; border-radius: 50%; pointer-events: none;
    &--a { width: 60vmax; height: 60vmax; right: -25vmax; top: 4vmax; background: radial-gradient(circle, rgba(198, 255, 0, 0.14), transparent 62%); }
    &--b { width: 45vmax; height: 45vmax; left: -20vmax; bottom: -10vmax; background: radial-gradient(circle, rgba(245, 245, 240, 0.07), transparent 62%); }
  }
  &__ring { position: absolute; z-index: -1; right: -8vw; top: 8%; width: clamp(260px, 42vw, 640px); color: rgba(245, 245, 240, 0.22); }

  &__title { font-size: clamp(3.6rem, 13.4vw, 19rem); margin: 1rem 0 clamp(1.5rem, 4vw, 3rem); }
  &__line { display: block; width: fit-content; &:nth-child(2) { margin-left: clamp(0rem, 9vw, 13rem); } }

  &__row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 2.5rem; }
  &__lead { max-width: 32ch; font-size: clamp(1.1rem, 1.8vw, 1.6rem); line-height: 1.4; }

  &__cta {
    position: relative; display: grid; place-items: center; width: clamp(9.5rem, 14vw, 13rem); aspect-ratio: 1; border-radius: 50%; background: var(--accent); color: var(--ink); overflow: hidden; margin-right: clamp(0rem, 6vw, 8rem);
    &-fill { position: absolute; inset: 0; background: var(--text); border-radius: 50%; transform: translateY(101%); transition: transform 0.7s var(--ease-out); }
    &-text { position: relative; display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85rem; }
    &:hover &-fill, &:focus-visible &-fill { transform: none; }
    &-text svg { transition: transform 0.5s var(--ease-out); }
    &:hover &-text svg { transform: translate(3px, -3px) rotate(45deg); }
  }

  &__links { display: grid; margin-top: clamp(2rem, 5vw, 4rem); border-top: 1px solid var(--line); @include desktop { grid-template-columns: repeat(4, 1fr); border-top: 0; gap: 2rem; } }
  &__link { display: grid; grid-template-columns: auto 1fr; gap: 0.2rem 0.9rem; align-items: center; padding: 1.1rem 0; border-bottom: 1px solid var(--line); word-break: break-word; transition: color 0.3s, border-color 0.3s;
    @include desktop { border-top: 1px solid var(--line); border-bottom: 0; }
    svg { color: var(--accent); grid-row: span 2; }
    &-label { font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
    &-value { font-size: 1rem; }
  }
  a.contact__link:hover { color: var(--accent); border-color: var(--accent); }
}
</style>
