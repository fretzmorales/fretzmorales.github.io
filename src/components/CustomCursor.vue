<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { gsap, MQ, prefersReducedMotion } from '../composables/useGsap'

const enabled = ref(false)
const ring = ref(null)
const dot = ref(null)
const label = ref('')
const state = ref('')

let cleanup = () => {}

onMounted(() => {
  if (!window.matchMedia(MQ.finePointer).matches || prefersReducedMotion()) return
  enabled.value = true
  document.documentElement.classList.add('has-cursor')

  requestAnimationFrame(() => {
    gsap.set([ring.value, dot.value], { xPercent: -50, yPercent: -50, opacity: 0 })
    const rx = gsap.quickTo(ring.value, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring.value, 'y', { duration: 0.55, ease: 'power3' })
    const dx = gsap.quickTo(dot.value, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.value, 'y', { duration: 0.12, ease: 'power3' })
    let shown = false

    const move = (e) => {
      if (!shown) {
        shown = true
        gsap.set([ring.value, dot.value], { x: e.clientX, y: e.clientY })
        gsap.to([ring.value, dot.value], { opacity: 1, duration: 0.4 })
      }
      rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY)
    }
    const over = (e) => {
      const t = e.target.closest?.('[data-cursor], a, button, [role="button"]')
      if (!t) { state.value = ''; label.value = ''; return }
      label.value = t.dataset?.cursor || ''
      state.value = label.value ? 'label' : 'hover'
    }
    const leave = () => gsap.to([ring.value, dot.value], { opacity: 0, duration: 0.3 }) && (shown = false)

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', over, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    cleanup = () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  })
})

onBeforeUnmount(() => {
  cleanup()
  document.documentElement.classList.remove('has-cursor')
})
</script>

<template>
  <div v-if="enabled" class="cursor" aria-hidden="true">
    <div ref="ring" class="cursor__ring" :class="`is-${state}`"><span>{{ label }}</span></div>
    <div ref="dot" class="cursor__dot" :class="{ 'is-hidden': state === 'label' }" />
  </div>
</template>

<style lang="scss" scoped>
.cursor { position: fixed; inset: 0; pointer-events: none; z-index: 950; }
.cursor__ring, .cursor__dot { position: fixed; top: 0; left: 0; border-radius: 50%; will-change: transform; }
.cursor__dot { width: 6px; height: 6px; background: var(--accent); transition: transform 0.3s; &.is-hidden { transform: scale(0); } }
.cursor__ring {
  width: 38px; height: 38px; border: 1px solid rgba(245, 245, 240, 0.55);
  display: grid; place-items: center;
  transition: width 0.45s var(--ease-out), height 0.45s var(--ease-out), background 0.3s, border-color 0.3s;
  span { font-size: 0.68rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; color: var(--ink); opacity: 0; transition: opacity 0.25s; }
  &.is-hover { width: 64px; height: 64px; border-color: var(--accent); }
  &.is-label { width: 96px; height: 96px; background: var(--accent); border-color: var(--accent); span { opacity: 1; } }
}
</style>
