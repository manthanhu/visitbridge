"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger, viewportOnce } from "@/lib/animations"
import { testimonials } from "@/data/testimonials"
import { CheckCircle2, Quote, Building2, ArrowRight } from "lucide-react"

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) {
  // Generate deterministic slight rotation for natural feel based on index
  const rotation = (index % 2 === 0 ? 1 : -1) * (((index * 13) % 15) / 10 + 0.5)

  return (
    <div 
      className="group relative flex-shrink-0 w-[300px] sm:w-[360px] md:w-[400px] rounded-3xl p-[1px] transition-all duration-500 hover:z-10"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--border)] to-[var(--border)] group-hover:from-primary/50 group-hover:via-accent/50 group-hover:to-primary/50 rounded-3xl transition-all duration-500" />
      
      <div className="relative h-full rounded-3xl bg-[var(--card)]/90 backdrop-blur-2xl p-7 flex flex-col group-hover:-translate-y-2 group-hover:rotate-0 transition-all duration-500 shadow-xl shadow-black/20 group-hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)]">
        
        {/* Quote watermark */}
        <div className="absolute top-6 right-6 text-white/[0.03] group-hover:text-primary/10 transition-colors duration-500">
          <Quote className="h-12 w-12 rotate-180" />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="relative h-14 w-14 rounded-full bg-[var(--card)] p-[2px]">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-base font-bold text-foreground">
                {testimonial.avatar}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-base font-bold text-foreground">{testimonial.name}</p>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-medium text-[var(--text-muted)]">
              {testimonial.college} &middot; &apos;{testimonial.year.slice(2)}
            </p>
          </div>
        </div>

        {/* Quote */}
        <p className="text-body text-[var(--text-secondary)] leading-relaxed mb-8 relative z-10 font-medium">
          &quot;{testimonial.quote}&quot;
        </p>

        {/* Footer / Role */}
        <div className="mt-auto pt-5 border-t border-[var(--border)] group-hover:border-white/10 transition-colors flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-white/[0.05] flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-muted)]">Visited <strong className="text-foreground">{testimonial.company}</strong></span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            {testimonial.role.split('→').map((part, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                {part.trim()}
                {i < arr.length - 1 && <ArrowRight className="h-3 w-3" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 lg:py-32 overflow-hidden relative bg-[var(--background)]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="max-w-2xl mx-auto text-center mb-20 lg:mb-24">
            <p className="text-label text-accent mb-4 tracking-widest uppercase">Student stories</p>
            <h2 className="text-display text-foreground">
              Real outcomes from <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-extrabold">real students</span>
            </h2>
            <p className="mt-6 text-body-lg text-[var(--text-secondary)]">
              These aren&apos;t marketing testimonials. These are students who visited companies through VisitBridge and changed their career trajectory.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee Container with Fade Masks */}
      <div className="relative group/marquee">
        {/* Left/Right Fade Masks */}
        <div className="absolute top-0 bottom-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[var(--background)] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[var(--background)] to-transparent z-20 pointer-events-none" />

        {/* Scrolling marquee row 1 */}
        <div className="relative mb-8">
          <div className="flex gap-8 w-max animate-[marquee_45s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
            {[...testimonials.slice(0, 4), ...testimonials.slice(0, 4), ...testimonials.slice(0, 4)].map((t, i) => (
              <TestimonialCard key={`row1-${i}`} testimonial={t} index={i} />
            ))}
          </div>
        </div>

        {/* Scrolling marquee row 2 (reverse) */}
        <div className="relative">
          <div className="flex gap-8 w-max animate-[marquee-reverse_50s_linear_infinite] group-hover/marquee:[animation-play-state:paused]">
            {[...testimonials.slice(4), ...testimonials.slice(4), ...testimonials.slice(4)].map((t, i) => (
              <TestimonialCard key={`row2-${i}`} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(calc(-100% / 3)); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}
