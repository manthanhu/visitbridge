"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Search, Users, Rocket } from "lucide-react"
import { fadeUp, stagger, viewportOnce } from "@/lib/animations"
import { useRef } from "react"

const steps = [
  {
    icon: <Search className="h-5 w-5" />,
    number: "01",
    title: "Browse & Choose",
    description:
      "Explore upcoming visits to top companies. Filter by industry, location, visit type, or company. Find the perfect match for your career goals.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    number: "02",
    title: "Join & Reach Threshold",
    description:
      "Express your interest and commit once the student threshold is met. We aggregate demand across colleges — you're never alone.",
  },
  {
    icon: <Rocket className="h-5 w-5" />,
    number: "03",
    title: "Visit & Connect",
    description:
      "Once confirmed, attend the visit. Meet engineers, tour offices, learn about culture, and discover internship or placement opportunities firsthand.",
  },
]

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  })

  // Line lights up progressively
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section id="how-it-works" ref={containerRef} className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="max-w-xl mx-auto text-center mb-16 md:mb-24">
            <p className="text-label text-primary mb-4 tracking-widest uppercase">How it works</p>
            <h2 className="text-h1 text-foreground">
              Three steps to your next <span className="text-gradient-blue">company visit</span>
            </h2>
            <p className="mt-5 text-body-lg text-[var(--text-secondary)]">
              No cold emails. No connections needed. Just students who want the same thing, organized together.
            </p>
          </motion.div>

          {/* Steps Container */}
          <div className="relative">
            {/* Desktop Glowing Connection Line */}
            <div className="hidden md:block absolute top-[100px] left-[16%] right-[16%] h-[2px] bg-white/[0.05] rounded-full overflow-hidden z-0">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                style={{ width: lineWidth }}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  className={`group relative ${i === 1 ? 'md:mt-5' : i === 2 ? 'md:mt-10' : ''}`}
                >
                  {/* Glowing hover border effect */}
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] -z-10" />

                  <div className="flex flex-col h-full rounded-2xl bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] p-8 lg:p-10 hover:bg-[var(--surface-hover)] transition-all duration-500 relative overflow-hidden glass-card">
                    
                    {/* Watermark Number */}
                    <div className="absolute -right-4 -bottom-8 text-[120px] font-bold text-white/[0.03] select-none pointer-events-none font-mono leading-none transition-transform duration-500 group-hover:scale-110">
                      {step.number}
                    </div>

                    {/* Icon in Glass Container */}
                    <div className="relative mb-8 self-start">
                      <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-primary group-hover:text-white transition-colors duration-500 shadow-inner group-hover:animate-pulse">
                        {step.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-body text-[var(--text-secondary)] leading-relaxed relative z-10">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
