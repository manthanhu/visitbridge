"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger, viewportOnce } from "@/lib/animations"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[var(--background)] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative rounded-[2.5rem] border border-[var(--border)] overflow-hidden shadow-2xl"
        >
          {/* Background Layers */}
          <div className="absolute inset-0 -z-10 bg-[var(--card)]" />
          
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 -z-10 opacity-30 animate-[gradient_8s_ease_infinite]" 
               style={{ background: 'linear-gradient(-45deg, #3b82f6, #8b5cf6, #3b82f6, #1e1e2a)', backgroundSize: '400% 400%' }} />
          
          {/* Dot Grid */}
          <div className="absolute inset-0 -z-10 opacity-[0.05]"
               style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "32px 32px" }} />
          
          {/* Moving Light Beams */}
          <div className="absolute -top-40 -right-40 w-96 h-[800px] bg-gradient-to-b from-transparent via-white/5 to-transparent rotate-45 -z-10 blur-3xl" />
          <div className="absolute top-20 -left-20 w-64 h-[600px] bg-gradient-to-b from-transparent via-primary/10 to-transparent rotate-45 -z-10 blur-3xl" />

          {/* Floating Particles (CSS handled) */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full blur-[1px] animate-[ping_4s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-accent/40 rounded-full blur-[1px] animate-[ping_6s_ease-in-out_infinite_1s]" />
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-400/50 rounded-full blur-[1px] animate-[ping_5s_ease-in-out_infinite_2s]" />

          <div className="px-5 py-16 sm:px-12 sm:py-24 lg:px-20 lg:py-32 text-center relative z-10 flex flex-col items-center">
            
            {/* Live Indicator */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-white mb-8 shadow-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              3 visits filling this week
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-display lg:text-7xl leading-[1.1] text-foreground max-w-4xl mx-auto font-extrabold tracking-tight mb-6">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">dream company</span> is waiting.
            </motion.h2>

            <motion.p variants={fadeUp} className="text-body-lg lg:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
              All you need is 29 other students. Browse upcoming visits, express your interest, and let us handle the coordination.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 w-full sm:w-auto">
              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500 animate-pulse" />
                <button className="relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold bg-white text-black rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-xl">
                  Explore Visits
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>

            {/* Social Proof Avatars */}
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
              <div className="flex -space-x-3">
                {['JD', 'AS', 'MK', 'PR', 'SL'].map((initials, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--card)] bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-bold text-white shadow-lg z-[5-i]">
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Join <strong className="text-foreground">2,400+</strong> students already visiting</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  )
}
