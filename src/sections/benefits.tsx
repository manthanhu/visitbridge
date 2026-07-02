"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger, viewportOnce } from "@/lib/animations"
import { Shield, Globe, CreditCard, GraduationCap, Handshake, BarChart3 } from "lucide-react"

const benefits = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Cross-College Access",
    description: "Your college doesn't need a direct pipeline. We aggregate demand from 45+ colleges to unlock visits no single institution could arrange alone.",
    tall: true,
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Risk-Free Commitment",
    description: "You only pay once the threshold is reached and the visit is confirmed. If it doesn't happen, you're never charged. Zero risk.",
    tall: false,
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    title: "Real Engineer Access",
    description: "These aren't marketing tours. You meet the actual engineers, sit in their workspace, and ask questions career fairs never answer.",
    tall: true,
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Career Acceleration",
    description: "92% of students who attended a visit reported it directly influenced their career decisions. 34% received job offers within 3 months.",
    tall: false,
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Affordable & Transparent",
    description: "Fees range from ₹800 to ₹2,000 — a fraction of what a conference ticket costs. No hidden charges, no upsells.",
    tall: true,
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Demand-Driven Scheduling",
    description: "Companies respond to student demand, not the other way around. When enough students want a visit, the company comes to you.",
    tall: false,
  },
]

export function Benefits() {
  return (
    <section className="py-16 md:py-24 lg:py-32 relative bg-[var(--background)] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03),transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Editorial Header */}
          <motion.div variants={fadeUp} className="text-center max-w-3xl mx-auto mb-20 lg:mb-28">
            <p className="text-label text-accent mb-4 tracking-widest uppercase">Why VisitBridge</p>
            <h2 className="text-display text-foreground mb-6">
              Built for students who refuse to wait.
            </h2>
            <p className="text-body-lg text-[var(--text-secondary)]">
              We solve the coordination problem. You focus on showing up and making an impression.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative"
              >
                {/* Layered Shadow & Glow */}
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/20 group-hover:to-accent/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm -z-10" />

                <div className={`relative rounded-3xl bg-[var(--card)] border border-[var(--border)] group-hover:border-[var(--border-hover)] transition-all duration-500 hover:-translate-y-1.5 shadow-lg shadow-black/20 group-hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] overflow-hidden ${benefit.tall ? 'p-8 lg:p-12 pb-16' : 'p-8 lg:p-10'}`}>
                  
                  {/* Subtle Spotlight top */}
                  <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Glass Icon Container */}
                  <div className="relative mb-8 self-start inline-flex">
                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary group-hover:text-white transition-colors duration-500 backdrop-blur-md">
                      {benefit.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-body text-[var(--text-secondary)] leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
