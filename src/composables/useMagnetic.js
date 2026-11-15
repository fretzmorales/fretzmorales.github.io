import { gsap, MQ } from './useGsap'

/**
 * v-magnetic directive — element drifts toward the pointer. Optional value = strength (default 0.35).
 * Only active on fine pointers; reduced-motion users get a plain element.
 */
export const vMagnetic = {
  mounted(el, { value }) {
    const fine = window.matchMedia(MQ.finePointer).matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return
    const strength = value ?? 0.35
    const x = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.5)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.5)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * strength)
      y((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => { x(0); y(0) }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    el._magnetic = { move, leave }
  },
  unmounted(el) {
    if (!el._magnetic) return
    el.removeEventListener('mousemove', el._magnetic.move)
    el.removeEventListener('mouseleave', el._magnetic.leave)
  },
}
