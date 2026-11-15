<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { ArrowDown } from 'lucide-vue-next'
import { gsap, ScrollTrigger, MQ, prefersReducedMotion } from '../composables/useGsap'
import { revealText } from '../composables/useReveal'
import { site } from '../data/site'
import SplitText from './SplitText.vue'

const props = defineProps({ ready: Boolean })

const root = ref(null)
let mm
let ctx

watch(() => props.ready, (v) => {
  if (!v || prefersReducedMotion()) return
  ctx.add(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from('.hero__orb', { scale: 0.55, opacity: 0, rotateX: 50, duration: 2.2 }, 0)
      .from('.hero__glow', { opacity: 0, duration: 2 }, 0)
      .from('.hero__tag', { opacity: 0, y: 20, duration: 1 }, 0.35)
    root.value.querySelectorAll('.hero__line').forEach((line, i) => revealText(line, { duration: 1.4, delay: 0.25 + i * 0.16 }))
    tl.from('.hero__bottom > *', { opacity: 0, y: 40, stagger: 0.12, duration: 1.2 }, 1)
      .from('.hero__float', { opacity: 0, scale: 0.6, stagger: 0.1, duration: 1.2, ease: 'back.out(2)' }, 1.1)
  })
})

onMounted(() => {
  ctx = gsap.context(() => {}, root.value)
  mm = gsap.matchMedia(root.value)

  // Parallax + scroll-velocity distortion (desktop/tablet with motion)
  mm.add(MQ.motionOk, () => {
    const scrub = { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true }
    gsap.to('.hero__line--1', { xPercent: -10, scrollTrigger: scrub })
    gsap.to('.hero__line--3', { xPercent: 8, scrollTrigger: scrub })
    gsap.to('.hero__orb', { yPercent: 30, scale: 1.2, scrollTrigger: scrub })
    gsap.to('.hero__float', { yPercent: (i) => -60 - i * 40, scrollTrigger: scrub })
    gsap.to('.hero__content', { opacity: 0, scrollTrigger: { ...scrub, start: '35% top' } })
    gsap.to('.hero__bottom', { yPercent: 60, opacity: 0, scrollTrigger: { ...scrub, end: '60% top' } })

    const skew = gsap.quickTo('.hero__title', 'skewY', { duration: 0.6, ease: 'power3' })
    ScrollTrigger.create({
      trigger: root.value, start: 'top top', end: 'bottom top',
      onUpdate: (self) => skew(gsap.utils.clamp(-6, 6, self.getVelocity() / -350)),
      onLeave: () => skew(0), onLeaveBack: () => skew(0),
    })
  })

  // Mouse-responsive depth (fine pointers only)
  mm.add(`${MQ.finePointer} and ${MQ.motionOk}`, () => {
    const gx = gsap.quickTo('.hero__glow', 'x', { duration: 1.2, ease: 'power3' })
    const gy = gsap.quickTo('.hero__glow', 'y', { duration: 1.2, ease: 'power3' })
    const ry = gsap.quickTo('.hero__tilt', 'rotationY', { duration: 1.4, ease: 'power3' })
    const rx = gsap.quickTo('.hero__tilt', 'rotationX', { duration: 1.4, ease: 'power3' })
    const floats = [...root.value.querySelectorAll('.hero__float')].map((el, i) => ({
      x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
      d: 18 + i * 14,
    }))
    const move = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      gx(nx * 220); gy(ny * 160)
      ry(nx * 35); rx(ny * -30)
      floats.forEach((f) => { f.x(nx * f.d * -2); f.y(ny * f.d * -2) })
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  })
})

onBeforeUnmount(() => { mm?.revert(); ctx?.revert() })
</script>

<template>
  <section id="home" ref="root" class="hero" aria-labelledby="hero-title">
    <div class="hero__glow" aria-hidden="true" />
    <div class="hero__grid" aria-hidden="true" />

    <div class="hero__orb" aria-hidden="true">
      <div class="hero__tilt">
        <div class="hero__sphere">
          <i v-for="n in 6" :key="n" class="ring" :style="{ '--r': `${(n - 1) * 30}deg` }" :class="{ 'is-accent': n === 3 }" />
          <i v-for="n in 3" :key="`l${n}`" class="lat" :style="{ '--z': `${(n - 2) * 34}%`, '--s': n === 2 ? 1 : 0.86 }" />
        </div>
      </div>
    </div>

    <span class="hero__float hero__float--a" aria-hidden="true">( WordPress )</span>
    <span class="hero__float hero__float--b" aria-hidden="true">&lt;/&gt; Frontend</span>
    <span class="hero__float hero__float--c" aria-hidden="true">9+ yrs</span>

    <div class="hero__content">
      <p class="hero__tag eyebrow">Independent Developer / {{ site.location }}</p>

      <h1 id="hero-title" class="hero__title display" aria-label="Building digital experiences.">
        <SplitText class="hero__line hero__line--1" text="Building" aria-hidden="true" />
        <SplitText class="hero__line hero__line--2 outline" text="Digital" aria-hidden="true" />
        <SplitText class="hero__line hero__line--3" text="Experiences." aria-hidden="true" />
      </h1>
    </div>

    <div class="hero__bottom">
      <p class="hero__intro">
        I'm a WordPress Developer &amp; Frontend Developer focused on building thoughtful, functional, and visually engaging digital experiences.
      </p>
      <a class="hero__scroll" href="#about" aria-label="Scroll to about section" data-cursor="Scroll">
        <span class="hero__scroll-line" aria-hidden="true" />
        <ArrowDown :size="16" aria-hidden="true" />
      </a>
      <div class="hero__status">
        <span class="hero__avail"><i aria-hidden="true" />Open to opportunities</span>
        <span class="hero__who">{{ site.name }} — {{ site.location }}</span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.hero {
  position: relative; min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end;
  padding: 7.5rem var(--gutter) 2rem; overflow: hidden; isolation: isolate;

  &__glow {
    position: absolute; z-index: -2; left: 50%; top: 45%; width: 70vmax; height: 70vmax; margin: -35vmax 0 0 -35vmax; border-radius: 50%;
    background: radial-gradient(circle, rgba(198, 255, 0, 0.13), rgba(198, 255, 0, 0.03) 35%, transparent 62%); pointer-events: none;
  }
  &__grid {
    position: absolute; inset: 0; z-index: -3; opacity: 0.5;
    background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
    background-size: 12.5vw 12.5vw; background-position: center;
    mask-image: radial-gradient(ellipse at 60% 40%, #000 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at 60% 40%, #000 0%, transparent 70%);
  }

  // 3D wireframe sphere
  &__orb {
    position: absolute; z-index: -1; right: -8vw; top: 14vh; width: clamp(280px, 48vw, 760px); aspect-ratio: 1; perspective: 1200px;
    @include below-desktop { right: -22vw; top: 10vh; opacity: 0.8; }
  }
  &__tilt { width: 100%; height: 100%; transform-style: preserve-3d; }
  &__sphere { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; animation: orbit 46s linear infinite; }
  .ring, .lat { position: absolute; inset: 0; border-radius: 50%; border: 1px solid rgba(245, 245, 240, 0.22); }
  .ring { transform: rotateY(var(--r)); &.is-accent { border-color: var(--accent); box-shadow: 0 0 24px rgba(198, 255, 0, 0.25); } }
  .lat { transform: rotateX(90deg) translateZ(var(--z)) scale(var(--s)); border-color: rgba(245, 245, 240, 0.14); }

  &__float {
    position: absolute; z-index: 1; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted);
    padding: 0.5rem 0.9rem; border: 1px solid var(--line); border-radius: 100px; backdrop-filter: blur(6px); background: rgba(8, 8, 8, 0.4);
    &--a { right: 34vw; top: 24vh; } &--b { right: 10vw; top: 46vh; color: var(--accent); border-color: rgba(198, 255, 0, 0.4); } &--c { right: 40vw; top: 58vh; }
    @include below-tablet { &--a { right: 8vw; top: 20vh; } &--b { display: none; } &--c { right: auto; left: var(--gutter); top: 30vh; } }
  }

  &__content { margin-bottom: clamp(2rem, 6vh, 4rem); }
  &__tag { margin-bottom: clamp(1rem, 3vh, 2rem); }
  &__title { font-size: clamp(4rem, 16.2vw, 25rem); will-change: transform; }
  &__line { display: block; width: fit-content; }
  &__line--2 { margin-left: clamp(2rem, 14vw, 22rem); @include below-tablet { margin-left: 12vw; } }
  &__line--3 :deep(.split__char:last-child) { color: var(--accent); }

  &__bottom {
    display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--line);
    @include below-tablet { grid-template-columns: 1fr; gap: 1.25rem; }
  }
  &__intro { max-width: 36ch; font-size: clamp(0.95rem, 1.1vw, 1.1rem); color: rgba(245, 245, 240, 0.82); }
  &__scroll {
    display: grid; justify-items: center; gap: 0.6rem; color: var(--muted); transition: color 0.3s; &:hover { color: var(--accent); }
    @include below-tablet { display: none; }
  }
  &__scroll-line { width: 1px; height: 54px; background: linear-gradient(var(--accent), transparent); transform-origin: top; animation: drip 2.2s var(--ease-out) infinite; }
  &__status { justify-self: end; text-align: right; display: grid; gap: 0.35rem; font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase; @include below-tablet { justify-self: start; text-align: left; } }
  &__avail { display: inline-flex; align-items: center; gap: 0.6rem; justify-content: flex-end; color: var(--text); @include below-tablet { justify-content: flex-start; }
    i { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 0 rgba(198, 255, 0, 0.6); animation: pulse 2s infinite; } }
  &__who { color: var(--muted); }
}

@keyframes orbit { to { transform: rotateY(360deg) rotateZ(0.001deg); } }
@keyframes drip { 0% { transform: scaleY(0); opacity: 1; } 60% { transform: scaleY(1); opacity: 1; } 100% { transform: scaleY(1); opacity: 0; } }
@keyframes pulse { 70% { box-shadow: 0 0 0 10px rgba(198, 255, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(198, 255, 0, 0); } }
</style>
