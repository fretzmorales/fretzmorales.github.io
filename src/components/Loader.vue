<script setup>
import { onMounted, ref } from 'vue'
import { gsap, prefersReducedMotion } from '../composables/useGsap'
import { site } from '../data/site'

const emit = defineEmits(['reveal', 'done'])
const root = ref(null)
const count = ref('000')

onMounted(async () => {
  if (prefersReducedMotion()) {
    emit('reveal')
    emit('done')
    return
  }
  // wait for fonts (max 2s) so the hero never reflows after the reveal
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))])

  const n = { v: 0 }
  const tl = gsap.timeline()
  tl.from('.loader__meta > *', { yPercent: 100, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out' })
    .to(n, {
      v: 100, duration: 1.5, ease: 'power2.inOut',
      onUpdate: () => (count.value = String(Math.round(n.v)).padStart(3, '0')),
    }, 0.1)
    .to('.loader__meta', { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' })
    .add(() => emit('reveal'))
    .to('.loader__panel', { yPercent: -101, duration: 1.1, ease: 'expo.inOut', stagger: { each: 0.07, from: 'center' } }, '<')
    .add(() => emit('done'))
})
</script>

<template>
  <div ref="root" class="loader" aria-hidden="true">
    <div v-for="i in 5" :key="i" class="loader__panel" />
    <div class="loader__meta">
      <span class="loader__label">{{ site.name }} — Portfolio</span>
      <span class="loader__count display">{{ count }}</span>
      <span class="loader__label">Loading experience</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  position: fixed; inset: 0; z-index: 800; display: flex; pointer-events: all;
  &__panel { flex: 1; background: var(--bg); will-change: transform; }
  &__meta {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1.25rem; overflow: hidden;
    > * { display: block; }
  }
  &__count { font-size: clamp(6rem, 22vw, 18rem); color: var(--accent); line-height: 0.9; font-variant-numeric: tabular-nums; }
  &__label { font-size: 0.72rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--muted); }
}
</style>
