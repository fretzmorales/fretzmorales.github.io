<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { gsap, MQ } from '../composables/useGsap'
import { revealText, inView } from '../composables/useReveal'
import { projects } from '../data/projects'
import { site } from '../data/site'
import SplitText from './SplitText.vue'
import ProjectItem from './ProjectItem.vue'

const root = ref(null)
const track = ref(null)
const current = ref(1)
let mm

const pad = (n) => String(n).padStart(2, '0')

onMounted(() => {
  mm = gsap.matchMedia(root.value)

  // ── Desktop: pinned horizontal showcase ────────────────────────────
  mm.add(`${MQ.desktop} and ${MQ.motionOk}`, () => {
    const el = root.value
    el.classList.add('is-horizontal')
    const dist = () => track.value.scrollWidth - window.innerWidth

    const tween = gsap.to(track.value, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: el, pin: true, scrub: 1, start: 'top top', anticipatePin: 1, invalidateOnRefresh: true,
        end: () => `+=${dist()}`,
        onUpdate: (self) => gsap.set('.works__progress-bar', { scaleX: self.progress }),
      },
    })

    gsap.from('.works__head .split__char', { yPercent: 120, rotate: 5, duration: 1.3, ease: 'expo.out', stagger: 0.03, scrollTrigger: { trigger: el, start: 'top 60%' } })

    el.querySelectorAll('.project').forEach((p, i) => {
      const cfg = { containerAnimation: tween }
      gsap.fromTo(p.querySelector('.project__img'), { xPercent: -4, scale: 1.12 }, {
        xPercent: 4, ease: 'none', scrollTrigger: { trigger: p, start: 'left right', end: 'right left', scrub: true, ...cfg },
      })
      gsap.from(p.querySelector('.project__shot'), {
        clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: p, start: 'left 78%', toggleActions: 'play none none reverse', ...cfg },
      })
      gsap.from(p.querySelectorAll('.project__title .split__char'), {
        yPercent: 120, rotate: 5, stagger: 0.02, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: p, start: 'left 60%', toggleActions: 'play none none reverse', ...cfg },
      })
      gsap.from(p.querySelectorAll('.project__cat, .project__role li, .project .link-arrow, .project__info .link-arrow'), {
        opacity: 0, y: 24, stagger: 0.07, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: p, start: 'left 50%', toggleActions: 'play none none reverse', ...cfg },
      })
      gsap.fromTo(p.querySelector('.project__num'), { xPercent: 25 }, {
        xPercent: -25, ease: 'none', scrollTrigger: { trigger: p, start: 'left right', end: 'right left', scrub: true, ...cfg },
      })
      gsap.to(el, {
        backgroundColor: projects[i].tone, ease: 'none',
        scrollTrigger: {
          trigger: p, start: 'left 55%', end: 'left 35%', scrub: true, ...cfg,
          onToggle: (s) => s.isActive && (current.value = i + 1),
        },
      })
    })
    gsap.set(el, { backgroundColor: '#080808' })

    return () => {
      el.classList.remove('is-horizontal')
      gsap.set(el, { clearProps: 'backgroundColor' })
    }
  })

  // ── Mobile / tablet / reduced motion: vertical showcase ────────────
  mm.add(`(max-width: 1023px), (max-height: 559px), (prefers-reduced-motion: reduce)`, () => {
    const motion = window.matchMedia(MQ.motionOk).matches
    if (!motion) return
    root.value.querySelectorAll('.project').forEach((p) => {
      gsap.from(p.querySelector('.project__shot'), { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.out', scrollTrigger: inView(p, { start: 'top 80%' }) })
      revealText(p.querySelector('.project__title'), { scrollTrigger: inView(p.querySelector('.project__title')) })
      gsap.from(p.querySelectorAll('.project__cat, .project__role li, .project__info .link-arrow'), { opacity: 0, y: 20, stagger: 0.06, duration: 0.8, scrollTrigger: inView(p.querySelector('.project__role')) })
    })
    revealText(root.value.querySelector('.works__head'), { scrollTrigger: inView('.works__head') })
  })
})

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="works" ref="root" class="works" aria-labelledby="works-title">
    <div ref="track" class="works__track">
      <header class="works__head">
        <p class="eyebrow">02 / Selected Works</p>
        <h2 id="works-title" class="display" aria-label="Selected Works">
          <span class="works__h-line" aria-hidden="true"><SplitText text="Selected" /></span>
          <span class="works__h-line outline" aria-hidden="true"><SplitText text="Works" /></span>
        </h2>
        <p class="works__hint">
          Three client websites, designed &amp; built in WordPress.
          <span class="works__drag" aria-hidden="true">Scroll <ArrowRight :size="16" /></span>
        </p>
      </header>

      <ProjectItem v-for="(p, i) in projects" :key="p.id" :project="p" :index="i" />

      <div class="works__end">
        <p class="display">More<br /><span class="accent">soon.</span></p>
        <a class="link-arrow" :href="`mailto:${site.email}`">Start a project <ArrowRight :size="16" aria-hidden="true" /></a>
      </div>
    </div>

    <div class="works__ui" aria-hidden="true">
      <span class="works__count"><b>{{ pad(current) }}</b> / {{ pad(projects.length) }}</span>
      <span class="works__progress"><i class="works__progress-bar" /></span>
      <span class="works__label">Selected Works</span>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.works {
  position: relative; background: var(--bg);
  &__track { display: flex; flex-direction: column; gap: clamp(5rem, 12vw, 9rem); padding: clamp(6rem, 14vw, 10rem) 0; }

  &__head { padding: 0 var(--gutter); display: grid; gap: 1.5rem; justify-items: start; h2 { font-size: clamp(4rem, 17vw, 9rem); } }
  &__h-line { display: block; }
  &__hint { color: var(--muted); max-width: 30ch; font-size: 0.95rem; }
  &__drag { display: none; }

  &__end { padding: 0 var(--gutter); display: grid; gap: 1.5rem; justify-items: start; p { font-size: clamp(4rem, 14vw, 7rem); } }
  &__ui { display: none; }

  // horizontal mode
  &.is-horizontal {
    height: 100vh; overflow: hidden;
    .works__track { height: 100%; width: max-content; flex-direction: row; align-items: center; gap: 0; padding: 0; will-change: transform; }
    .works__head { flex: 0 0 auto; width: 70vw; height: 100%; align-content: center; padding-right: 6vw; h2 { font-size: clamp(6rem, 15vw, 17rem); } }
    .works__drag { display: inline-flex; align-items: center; gap: 0.6rem; margin-left: 1.5rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.72rem; }
    .works__end { flex: 0 0 auto; width: 60vw; height: 100%; align-content: center; padding-left: 8vw; p { font-size: clamp(6rem, 13vw, 14rem); } }
    .works__ui {
      position: absolute; left: var(--gutter); right: var(--gutter); bottom: 2.2rem; z-index: 5; display: flex; align-items: center; gap: 1.5rem; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted);
      b { color: var(--accent); font-weight: 700; }
    }
    :deep(.project) { flex: 0 0 auto; width: 100vw; height: 100vh; align-items: center; grid-template-columns: minmax(0, 54vw) minmax(0, 1fr); column-gap: 4vw; }
    :deep(.project__num) { top: auto; bottom: 7vh; left: var(--gutter); right: auto; font-size: 28vh; }
    :deep(.project__shot) { width: 100%; }
    :deep(.project.is-high .project__shot) { transform: translateY(-4vh); }
    :deep(.project.is-low .project__shot) { transform: translateY(4vh); }
    :deep(.project__title) { font-size: clamp(2.2rem, 3.4vw, 5rem); margin-left: 0; }
    :deep(.project__clip) { aspect-ratio: auto; height: min(56vh, 33vw); }
    .works__progress { flex: 1; height: 1px; background: var(--line); i { display: block; height: 100%; background: var(--accent); transform-origin: left; transform: scaleX(0); } }
  }
}
</style>
