import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './useGsap'

let lenis = null
let tick = null

/** Boots Lenis once and drives it from GSAP's ticker so ScrollTrigger stays in sync. */
export function initLenis() {
  if (lenis) return lenis
  if (prefersReducedMotion()) return null

  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function destroyLenis() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  lenis.destroy()
  lenis = null
}

export const getLenis = () => lenis

export function stopScroll() { lenis ? lenis.stop() : (document.documentElement.style.overflow = 'hidden') }
export function startScroll() { lenis ? lenis.start() : (document.documentElement.style.overflow = '') }

/** Smooth-scroll to a selector / element / pixel offset (native scroll when Lenis is off). */
export function scrollToTarget(target, opts = {}) {
  if (lenis) return lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts })
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (typeof target === 'number') window.scrollTo({ top: target })
  else el?.scrollIntoView()
}
