<script setup>
// Renders text as masked words (and optionally chars) so GSAP can reveal them.
// Query parts with `.split__char` / `.split__word` inside the component root.
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  tag: { type: String, default: 'span' },
  chars: { type: Boolean, default: true },
})

const words = computed(() => props.text.split(' ').filter(Boolean).map((w) => (props.chars ? [...w] : w)))
</script>

<template>
  <component :is="tag" class="split" :aria-label="text">
    <template v-for="(word, i) in words" :key="i">
      <span class="split__word" aria-hidden="true">
        <template v-if="chars"><span v-for="(c, j) in word" :key="j" class="split__char">{{ c }}</span></template>
        <span v-else class="split__char">{{ word }}</span>
      </span>
      {{ ' ' }}
    </template>
  </component>
</template>
