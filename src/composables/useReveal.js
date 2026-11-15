import { gsap } from './useGsap'

const parts = (el) => el.querySelectorAll('.split__char')

/** Masked rise-in of SplitText parts. Pass `scrollTrigger` in vars to run on scroll. */
export function revealText(el, vars = {}) {
  if (!el) return null
  return gsap.from(parts(el), {
    yPercent: 120,
    rotate: 5,
    duration: 1.2,
    ease: 'expo.out',
    stagger: { each: 0.025, from: 'start' },
    ...vars,
  })
}

export const inView = (trigger, extra = {}) => ({ trigger, start: 'top 85%', toggleActions: 'play none none none', ...extra })
