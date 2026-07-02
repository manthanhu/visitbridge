"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger, viewportOnce } from "@/lib/animations"
import { companies } from "@/data/companies"
import { visits } from "@/data/visits"
import { MapPin, ArrowUpRight } from "lucide-react"
import { DemandMeter } from "@/components/demand-meter"

export function FeaturedCompanies() {
  const featured = companies.slice(0, 6)

  return (
    <section className="py-32 lg:py-40 relative bg-[var(--surface)] overflow-hidden">
      {/* Noise overlay specific to this section */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+Cjwvc3ZnPg==')] opacity-50 pointer-events-none" />

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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <p className="text-label text-primary tracking-widest uppercase">Partner companies</p>
              </div>
              <h2 className="text-display text-foreground">
                Companies students are visiting
              </h2>
            </div>
            <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.03] border border-[var(--border)] hover:bg-white/[0.06] hover:border-primary/50 text-sm font-medium text-foreground transition-all self-start sm:self-auto shadow-sm">
              View all companies
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-primary" />
            </button>
          </motion.div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featured.map((company) => {
              const companyVisits = visits.filter((v) => v.companyId === company.id)
              const openVisits = companyVisits.filter((v) => v.status !== "COMPLETED")
              const totalDemand = companyVisits.reduce((sum, v) => sum + v.seatsFilled, 0)
              const totalSeats = companyVisits.reduce((sum, v) => sum + v.seatsTotal, 0)

              return (
                <motion.div
                  key={company.id}
                  variants={fadeUp}
                  className="group relative cursor-pointer"
                >
                  {/* Layered Shadow & Hover Glow */}
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/0 via-transparent to-accent/0 group-hover:from-primary/30 group-hover:to-accent/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[2px] -z-10" />

                  <div className="relative h-full rounded-3xl bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] group-hover:border-[var(--border-hover)] p-6 lg:p-8 hover:-translate-y-2 transition-all duration-500 shadow-lg group-hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] flex flex-col overflow-hidden">
                    
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="relative group-hover:scale-105 transition-transform duration-500">
                          {/* Background Glow behind Logo */}
                          <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                          <div className="relative h-14 w-14 rounded-2xl bg-white/[0.04] flex items-center justify-center text-foreground text-xl font-bold border border-white/[0.08] shadow-inner overflow-hidden">
                            {/* Animated gradient background on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="relative z-10">{company.logo}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {company.name}
                          </h3>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.05] text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
                            {company.industry}
                          </span>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-white/[0.03] flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300 border border-[var(--border)] group-hover:border-primary/20">
                        <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-primary transition-all -translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-6 font-medium">
                      <MapPin className="h-4 w-4 text-primary/70" />
                      {company.location}
                    </div>

                    <div className="mt-auto">
                      {/* Demand meter */}
                      {totalSeats > 0 && (
                        <div className="group-hover:scale-[1.02] transition-transform duration-500 origin-left">
                          <DemandMeter filled={totalDemand} total={totalSeats} />
                        </div>
                      )}

                      {/* Bottom stats */}
                      <div className="flex items-center justify-between mt-6 pt-5 border-t border-[var(--border)] group-hover:border-white/10 transition-colors duration-300">
                        <span className="text-sm text-[var(--text-secondary)]">
                          <strong className="text-foreground">{openVisits.length}</strong> upcoming {openVisits.length === 1 ? "visit" : "visits"}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-medium bg-white/[0.03] px-2 py-1 rounded-md">
                          {company.visitCount} total visits
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
    </section>
  )
}
