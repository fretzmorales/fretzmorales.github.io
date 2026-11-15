<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import SplitText from './SplitText.vue'

defineProps({ project: { type: Object, required: true }, index: { type: Number, default: 0 } })
</script>

<template>
  <article class="project" :class="index % 2 ? 'is-low' : 'is-high'" :aria-labelledby="`p-${project.id}`">
    <span class="project__num display outline" aria-hidden="true">{{ project.number }}</span>

    <a class="project__shot" :href="project.url" target="_blank" rel="noopener noreferrer" data-cursor="Visit" :aria-label="`Visit ${project.name} (opens in a new tab)`">
      <span class="project__clip">
        <img class="project__img" :src="project.image" :alt="`Screenshot of the ${project.name} website`" width="1440" height="900" loading="lazy" decoding="async" />
      </span>
      <span class="project__bar" aria-hidden="true"><i /><i /><i /><em>{{ project.host }}</em></span>
    </a>

    <div class="project__info">
      <h3 :id="`p-${project.id}`" class="project__title display" :aria-label="project.name">
        <span v-for="(line, i) in project.title" :key="i" class="project__line" aria-hidden="true"><SplitText :text="line" /></span>
      </h3>
      <p class="project__cat">{{ project.category }}</p>
      <ul class="project__role" aria-label="My role">
        <li v-for="r in project.role" :key="r">{{ r }}</li>
      </ul>
      <a class="link-arrow" :href="project.url" target="_blank" rel="noopener noreferrer">
        Visit live site <ArrowUpRight :size="16" aria-hidden="true" />
      </a>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '../styles/tokens' as *;

.project {
  position: relative; display: grid; gap: 1.5rem; padding: 0 var(--gutter);
  &__num { position: absolute; z-index: 0; top: -2rem; right: var(--gutter); font-size: clamp(7rem, 22vw, 22rem); opacity: 0.35; pointer-events: none; -webkit-text-stroke-color: var(--line); }

  &__shot { position: relative; z-index: 1; display: block; background: var(--bg-2); border: 1px solid var(--line); overflow: hidden; }
  &__bar { display: flex; align-items: center; gap: 6px; height: 2rem; padding: 0 0.9rem; background: #151515; border-top: 1px solid var(--line);
    i { width: 8px; height: 8px; border-radius: 50%; background: #333; } em { margin-left: 0.8rem; font-style: normal; font-size: 0.7rem; letter-spacing: 0.1em; color: var(--muted); } }
  &__clip { display: block; overflow: hidden; aspect-ratio: 16/10; }
  &__img { width: 100%; height: 100%; object-fit: cover; object-position: top; transform: scale(1.02); filter: grayscale(0.9) contrast(1.05); transition: filter 0.8s, transform 1.2s var(--ease-out); }
  &__shot:hover &__img, &__shot:focus-visible &__img { filter: none; transform: scale(1.07); }

  &__info { position: relative; z-index: 2; display: grid; gap: 1rem; align-content: start; justify-items: start; }
  &__title { font-size: clamp(2.6rem, 9vw, 5rem); }
  &__line { display: block; }
  &__cat { font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); }
  &__role { display: grid; gap: 0.35rem; color: rgba(245, 245, 240, 0.78); font-size: 0.95rem; max-width: 34rem;
    li { padding-left: 1.1rem; position: relative; &::before { content: ''; position: absolute; left: 0; top: 0.7em; width: 0.5rem; height: 1px; background: var(--accent); } } }
}
</style>
