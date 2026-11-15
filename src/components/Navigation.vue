<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { gsap, ScrollTrigger } from '../composables/useGsap'
import { scrollToTarget, stopScroll, startScroll } from '../composables/useLenis'
import { navItems, site } from '../data/site'

const props = defineProps({ active: { type: String, default: 'home' }, ready: Boolean })

const open = ref(false)
const bar = ref(null)
const header = ref(null)
let hideTrigger

function go(id) {
  const close = open.value
  open.value = false
  const run = () => {
    scrollToTarget(id === 'home' ? 0 : `#${id}`)
    history.replaceState(null, '', id === 'home' ? location.pathname : `#${id}`)
  }
  // let the overlay release the scroll lock first on mobile
  close ? setTimeout(run, 50) : run()
}

watch(open, (v) => (v ? stopScroll() : startScroll()))
watch(() => props.ready, (v) => {
  if (v) gsap.from(header.value, { yPercent: -100, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.5 })
})

const onKey = (e) => e.key === 'Escape' && (open.value = false)

onMounted(() => {
  window.addEventListener('keydown', onKey)
  gsap.set(bar.value, { scaleX: 0, transformOrigin: 'left center' })
  gsap.to(bar.value, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })

  // hide on scroll down, show on scroll up
  hideTrigger = ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      if (open.value) return
      const y = self.scroll()
      const hide = self.direction === 1 && y > 160
      gsap.to(header.value, { yPercent: hide ? -110 : 0, duration: 0.5, ease: 'power3.out', overwrite: true })
    },
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  hideTrigger?.kill()
})
</script>

<template>
  <header ref="header" class="nav" :class="{ 'is-open': open }">
    <div ref="bar" class="nav__progress" aria-hidden="true" />
    <a class="nav__logo" href="#home" aria-label="Back to top" data-cursor="Top" @click.prevent="go('home')">
      <span class="nav__mark" aria-hidden="true">✳</span>
      <span class="nav__name">{{ site.name }}</span>
    </a>

    <nav class="nav__desktop" aria-label="Primary">
      <ul>
        <li v-for="(item, i) in navItems" :key="item.id">
          <a :href="`#${item.id}`" :class="{ 'is-active': active === item.id }" :aria-current="active === item.id ? 'true' : undefined" @click.prevent="go(item.id)">
            <span class="nav__num">0{{ i + 1 }}</span>
            <span class="nav__roll" :data-label="item.label"><span>{{ item.label }}</span></span>
          </a>
        </li>
      </ul>
    </nav>

    <button class="nav__toggle" type="button" :aria-expanded="open" aria-controls="menu" @click="open = !open">
      <span class="sr-only">{{ open ? 'Close menu' : 'Open menu' }}</span>
      <span class="nav__toggle-label" aria-hidden="true">{{ open ? 'Close' : 'Menu' }}</span>
      <span class="nav__burger" aria-hidden="true"><i /><i /></span>
    </button>

    <div id="menu" class="menu" :class="{ 'is-open': open }" :inert="!open">
      <ul>
        <li v-for="(item, i) in navItems" :key="item.id" :style="{ '--i': i }">
          <a :href="`#${item.id}`" :class="{ 'is-active': active === item.id }" @click.prevent="go(item.id)">
            <small>0{{ i + 1 }}</small>{{ item.label }}
          </a>
        </li>
      </ul>
      <p class="menu__foot">{{ site.role }} — {{ site.location }}</p>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 700;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem var(--gutter);
  background: linear-gradient(to bottom, rgba(8, 8, 8, 0.85), rgba(8, 8, 8, 0));

  &__progress { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent); }

  &__logo { display: inline-flex; align-items: center; gap: 0.7rem; position: relative; z-index: 2; font-weight: 600; letter-spacing: 0.04em; font-size: 0.95rem; }
  &__mark { color: var(--accent); font-size: 1.3rem; display: inline-block; animation: spin 14s linear infinite; }

  &__desktop { display: none; @include desktop { display: block; } ul { display: flex; gap: 2.4rem; } }
  &__desktop a {
    display: flex; gap: 0.5rem; align-items: baseline; font-size: 0.78rem; letter-spacing: 0.16em; text-transform: uppercase; position: relative; padding: 0.4rem 0;
    color: var(--muted); transition: color 0.4s;
    &:hover, &.is-active { color: var(--text); }
    &::after { content: ''; position: absolute; left: 0; bottom: 0; height: 1px; width: 100%; background: var(--accent); transform: scaleX(0); transform-origin: right; transition: transform 0.6s var(--ease-out); }
    &.is-active::after, &:hover::after { transform: scaleX(1); transform-origin: left; }
  }
  &__num { color: var(--accent); font-size: 0.62rem; opacity: 0; transform: translateY(4px); transition: 0.4s; }
  a.is-active &__num, a:hover &__num { opacity: 1; transform: none; }
  &__roll { display: inline-block; overflow: hidden; height: 1.2em; line-height: 1.2; position: relative;
    > span { display: block; transition: transform 0.6s var(--ease-out); }
    &::after { content: attr(data-label); position: absolute; left: 0; top: 100%; color: var(--accent); transition: transform 0.6s var(--ease-out); }
  }
  a:hover &__roll > span, a:hover &__roll::after { transform: translateY(-100%); }

  &__toggle { position: relative; z-index: 2; display: flex; align-items: center; gap: 0.8rem; font-size: 0.78rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.5rem 0; @include desktop { display: none; } }
  &__burger { width: 28px; height: 10px; position: relative; i { position: absolute; left: 0; width: 100%; height: 1.5px; background: var(--text); transition: transform 0.5s var(--ease-out); &:first-child { top: 0; } &:last-child { bottom: 0; } } }
  &.is-open &__burger i:first-child { transform: translateY(4.25px) rotate(45deg); background: var(--accent); }
  &.is-open &__burger i:last-child { transform: translateY(-4.25px) rotate(-45deg); background: var(--accent); }
}

.menu {
  position: fixed; inset: 0; z-index: 1; background: var(--bg); display: flex; flex-direction: column; justify-content: center; padding: 6rem var(--gutter) 2rem;
  clip-path: inset(0 0 100% 0); transition: clip-path 0.9s var(--ease-out);
  &.is-open { clip-path: inset(0 0 0 0); }
  ul { display: grid; gap: 0.2rem; }
  li { overflow: hidden; }
  a {
    display: flex; align-items: baseline; gap: 1rem; font-family: var(--font-display); text-transform: uppercase; font-size: clamp(3rem, 14vw, 6rem); line-height: 1.05;
    transform: translateY(110%); transition: transform 0.9s var(--ease-out), color 0.3s; transition-delay: calc(var(--i) * 0.05s);
    small { font-family: var(--font-body); font-size: 0.75rem; letter-spacing: 0.2em; color: var(--accent); }
    &.is-active { color: var(--accent); }
  }
  &.is-open a { transform: none; }
  &__foot { margin-top: 2.5rem; color: var(--muted); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
