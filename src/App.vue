<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { ScrollTrigger } from './composables/useGsap'
import { initLenis, destroyLenis, startScroll, stopScroll } from './composables/useLenis'
import { navItems } from './data/site'

import Loader from './components/Loader.vue'
import CustomCursor from './components/CustomCursor.vue'
import Navigation from './components/Navigation.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import WorksSection from './components/WorksSection.vue'
import ExpertiseSection from './components/ExpertiseSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ContactSection from './components/ContactSection.vue'
import FooterSection from './components/FooterSection.vue'

const ready = ref(false)
const loading = ref(true)
const active = ref('home')
let triggers = []

const reveal = () => { ready.value = true; startScroll() }

onMounted(async () => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  initLenis()
  stopScroll()
  window.scrollTo(0, 0)

  await nextTick()
  // Created after every child so pin-spacing from the Works section is already accounted for.
  triggers = navItems.map(({ id }) =>
    ScrollTrigger.create({
      trigger: `#${id}`,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && (active.value = id),
    }),
  )
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
})

onBeforeUnmount(() => {
  triggers.forEach((t) => t.kill())
  destroyLenis()
})
</script>

<template>
  <a class="skip-link" href="#about">Skip to content</a>
  <div class="grain" aria-hidden="true" />
  <CustomCursor />
  <Loader v-if="loading" @reveal="reveal" @done="loading = false" />
  <Navigation :active="active" :ready="ready" />
  <main>
    <HeroSection :ready="ready" />
    <AboutSection />
    <WorksSection />
    <ExpertiseSection />
    <ExperienceSection />
    <ContactSection />
  </main>
  <FooterSection />
</template>
