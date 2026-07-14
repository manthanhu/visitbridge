"use client"

import Link from "next/link"

import { motion } from "framer-motion"
import { fadeUp, stagger, viewportOnce } from "@/lib/animations"
import { visits } from "@/data/visits"
import { formatCurrency } from "@/lib/utils"
import { StatusBadge } from "@/components/status-badge"
import { DemandMeter } from "@/components/demand-meter"
import { Calendar, ArrowRight, ArrowUpRight, Users } from "lucide-react"

export function UpcomingVisits() {
  const upcoming = visits.filter((v) => v.status !== "COMPLETED").slice(0, 4)

  return (
    <section className="py-16 md:py-24 lg:py-32 relative bg-[var(--background)] overflow-hidden">
      {/* Background with abstract shapes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.03),transparent_50%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-20 lg:mb-24">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <p className="text-label text-amber-500 tracking-widest uppercase">Upcoming visits</p>
              </div>
              <h2 className="text-display text-foreground">
                Don&apos;t miss out — spots are filling
              </h2>
            </div>
            <Link href="/visits" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.03] border border-[var(--border)] hover:bg-white/[0.06] hover:border-amber-500/50 text-sm font-medium text-foreground transition-all self-start sm:self-auto shadow-sm">
              Browse all visits
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-amber-500" />
            </Link>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {upcoming.map((visit) => {
              const seatsLeft = visit.seatsTotal - visit.seatsFilled;
              return (
                <motion.div
                  key={visit.id}
                  variants={fadeUp}
                  className="group relative cursor-pointer"
                >
                  {/* Layered Shadow & Hover Glow */}
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-amber-500/0 via-transparent to-primary/0 group-hover:from-amber-500/20 group-hover:to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[2px] -z-10" />

                  <div className="relative h-full rounded-3xl bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] group-hover:border-[var(--border-hover)] p-6 lg:p-8 hover:-translate-y-2 transition-all duration-500 shadow-lg group-hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.1)] flex flex-col">
                    
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl bg-white/[0.04] flex items-center justify-center text-foreground text-lg font-bold border border-white/[0.08] shadow-inner group-hover:scale-105 transition-transform duration-500">
                          {visit.companyLogo}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors">{visit.companyName}</p>
                          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">{visit.industry}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={visit.status} className="scale-110 origin-top-right group-hover:animate-pulse" />
                        
                        {/* Floating Price Badge */}
                        <div className="px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.15)] mt-2">
                          {formatCurrency(visit.fee)}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-1">
                      {visit.title}
                    </h3>
                    <p className="text-body text-[var(--text-secondary)] line-clamp-2 mb-8">
                      {visit.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.05] border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap">
                        <Calendar className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        {new Date(visit.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.05] border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap">
                        <Users className="mr-1.5 h-3.5 w-3.5 text-accent" />
                        {visit.seatsTotal - visit.seatsFilled} seats left
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-semibold text-amber-500 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {seatsLeft} seats left
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium">
                          +{(visit.seatsFilled % 5) + 2} joined recently
                        </span>
                      </div>
                      {/* Demand meter with shimmer */}
                      <div className="relative group-hover:scale-[1.01] transition-transform duration-500">
                        <DemandMeter filled={visit.seatsFilled} total={visit.seatsTotal} showLabel={false} />
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
                      </div>

                      {/* Bottom action */}
                      <div className="flex items-center justify-between mt-6 pt-5 border-t border-[var(--border)] overflow-hidden">
                        <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-foreground transition-colors">
                          Click to view full itinerary
                        </span>
                        <span className="inline-flex items-center gap-2 text-sm text-primary font-bold opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          View details
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  )
}
