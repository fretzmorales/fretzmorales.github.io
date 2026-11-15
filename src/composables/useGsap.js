import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Media conditions shared by every component so JS and CSS agree.
export const MQ = {
  desktop: '(min-width: 1024px) and (min-height: 560px)',
  motionOk: '(prefers-reduced-motion: no-preference)',
  finePointer: '(hover: hover) and (pointer: fine)',
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger }
