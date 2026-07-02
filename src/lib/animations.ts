import type { Variants, Transition } from "framer-motion"

// ─── Shared Transitions ────────────────────────────────────────
export const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

export const springGentle: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
}

export const easeOut: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
}

// ─── Fade Up ───────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export const fadeUpSlow: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

// ─── Fade In ───────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

// ─── Scale In ──────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

// ─── Stagger Container ────────────────────────────────────────
export const stagger = (staggerDelay = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
})

// ─── Slide In From Left ────────────────────────────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

// ─── Slide In From Right ───────────────────────────────────────
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

// ─── Card Hover ────────────────────────────────────────────────
export const cardHover = {
  rest: { y: 0, transition: springGentle },
  hover: { y: -4, transition: springGentle },
}

// ─── Viewport trigger defaults ─────────────────────────────────
export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
}
