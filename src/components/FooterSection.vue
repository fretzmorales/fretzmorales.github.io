<script setup>
import { ArrowUp, Linkedin, Mail } from 'lucide-vue-next'
import { scrollToTarget } from '../composables/useLenis'
import { site } from '../data/site'

const year = new Date().getFullYear()
const socials = [
  { label: 'LinkedIn', href: site.linkedin, icon: Linkedin },
  { label: 'Email', href: `mailto:${site.email}`, icon: Mail },
]
const top = () => scrollToTarget(0, { duration: 2.2 })
</script>

<template>
  <footer class="foot">
    <div class="foot__marquee" aria-hidden="true">
      <div class="foot__track">
        <span v-for="n in 8" :key="n" class="display">Open to opportunities <i>✳</i></span>
      </div>
    </div>

    <div class="foot__bar">
      <p class="foot__copy">© {{ year }} {{ site.name }}. All rights reserved.</p>

      <ul class="foot__social">
        <li v-for="s in socials" :key="s.label">
          <a :href="s.href" :aria-label="s.label" :target="s.href.startsWith('http') ? '_blank' : undefined" rel="noopener noreferrer"><component :is="s.icon" :size="18" aria-hidden="true" /></a>
        </li>
      </ul>

      <button v-magnetic="0.4" class="foot__top" type="button" aria-label="Back to top" @click="top">
        <span>Top</span><ArrowUp :size="16" aria-hidden="true" />
      </button>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.foot {
  background: #050505; overflow: hidden; border-top: 1px solid var(--line);
  &__marquee { padding: 1.5rem 0; border-bottom: 1px solid var(--line); }
  &__track { display: flex; width: max-content; animation: marquee 40s linear infinite;
    span { font-size: clamp(2.5rem, 7vw, 6rem); padding-right: 2rem; white-space: nowrap; -webkit-text-stroke: 1px var(--line); color: transparent; }
    i { font-style: normal; color: var(--accent); display: inline-block; animation: spin 8s linear infinite; margin-left: 2rem; -webkit-text-stroke: 0; }
  }
  &__bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 2rem var(--gutter); }
  &__copy { color: var(--muted); font-size: 0.85rem; }
  &__social { display: flex; gap: 0.75rem; a { display: grid; place-items: center; width: 2.6rem; height: 2.6rem; border: 1px solid var(--line); border-radius: 50%; transition: background 0.3s, color 0.3s, border-color 0.3s; &:hover { background: var(--accent); color: var(--ink); border-color: var(--accent); } } }
  &__top { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.8rem 1.3rem; border: 1px solid var(--line); border-radius: 100px; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; transition: background 0.3s, color 0.3s; &:hover { background: var(--accent); color: var(--ink); } }
}

@keyframes marquee { to { transform: translateX(-50%); } }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
