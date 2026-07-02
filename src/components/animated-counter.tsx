"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, motion } from "framer-motion"

interface AnimatedCounterProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
}

// easeOutQuart: fast start, elegant deceleration
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

export function AnimatedCounter({ target, duration = 2, suffix = "", prefix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (!isInView) return

    const totalFrames = duration * 60
    let frame = 0

    const timer = setInterval(() => {
      frame++
      const progress = Math.min(frame / totalFrames, 1)
      const easedProgress = easeOutQuart(progress)
      const current = Math.floor(easedProgress * target)

      setCount(current)

      if (progress >= 1) {
        setCount(target)
        clearInterval(timer)
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
    >
      {prefix}{count.toLocaleString("en-IN")}{suffix}
    </motion.span>
  )
}
