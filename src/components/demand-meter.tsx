"use client"

import { motion } from "framer-motion"

interface DemandMeterProps {
  filled: number
  total: number
  showLabel?: boolean
}

export function DemandMeter({ filled, total, showLabel = true }: DemandMeterProps) {
  const percentage = Math.min((filled / total) * 100, 100)

  const getColor = () => {
    if (percentage >= 80) return "from-red-500 to-red-400"
    if (percentage >= 50) return "from-amber-500 to-amber-400"
    return "from-primary to-blue-400"
  }

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-tiny text-[var(--text-muted)]">Student demand</span>
          <span className="text-tiny font-medium text-[var(--text-secondary)]">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${getColor()}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}
