"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger, viewportOnce } from "@/lib/animations"
import { AnimatedCounter } from "@/components/animated-counter"
import { Users, Building2, Map, Briefcase, Star, Trophy } from "lucide-react"

const stats = [
  { label: "Students joined", value: 2400, suffix: "+", icon: <Users />, color: "from-blue-500 to-cyan-400", bgGlow: "rgba(59,130,246,0.15)" },
  { label: "Company partners", value: 50, suffix: "+", icon: <Building2 />, color: "from-purple-500 to-pink-400", bgGlow: "rgba(168,85,247,0.15)" },
  { label: "Cities covered", value: 12, suffix: "", icon: <Map />, color: "from-amber-500 to-orange-400", bgGlow: "rgba(245,158,11,0.15)" },
  { label: "Visits completed", value: 180, suffix: "+", icon: <Briefcase />, color: "from-emerald-500 to-teal-400", bgGlow: "rgba(16,185,129,0.15)" },
  { label: "Placement offers", value: 340, suffix: "+", icon: <Trophy />, color: "from-indigo-500 to-blue-400", bgGlow: "rgba(99,102,241,0.15)" },
  { label: "Satisfaction rate", value: 92, suffix: "%", icon: <Star />, color: "from-rose-500 to-red-400", bgGlow: "rgba(244,63,94,0.15)" },
]

export function Statistics() {
  return (
    <section className="py-16 md:py-24 lg:py-32 relative bg-[var(--surface)] overflow-hidden">
      {/* Background subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface)] to-[var(--surface)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-20 lg:mb-24">
            <p className="text-label text-primary mb-4 tracking-widest uppercase">By the numbers</p>
            <h2 className="text-display text-foreground">
              The numbers speak for themselves
            </h2>
            <p className="mt-6 text-body-lg text-[var(--text-secondary)]">
              Our impact grows every day as more students choose to bridge the gap.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative"
              >
                {/* Layered Shadow & Glow */}
                <div className="absolute -inset-[1px] bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm -z-10" />

                <div 
                  className="relative h-full rounded-3xl bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] group-hover:border-[var(--border-hover)] p-8 lg:p-10 text-center hover:scale-[1.02] transition-all duration-500 flex flex-col items-center justify-center shadow-lg group-hover:shadow-2xl overflow-hidden"
                  style={{ boxShadow: `inset 0 0 60px -20px ${stat.bgGlow}` }}
                >
                  {/* Subtle pulsing background ring */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-700 animate-ping" style={{ animationDuration: '3s' }} />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`relative h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white group-hover:animate-pulse shadow-inner bg-gradient-to-br ${stat.color}`}>
                      <div className="w-6 h-6">
                        {stat.icon}
                      </div>
                    </div>
                  </div>

                  {/* Counter */}
                  <div className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground mb-4 tracking-tighter drop-shadow-2xl">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2.5} />
                  </div>
                  
                  <p className="text-base font-medium text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
