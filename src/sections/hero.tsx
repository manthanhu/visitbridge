"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, MapPin, Sparkles, Building2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { visits } from "@/data/visits"

// ─── Live Activity Feed ────────────────────────────────────────────────────────
const activities = [
  "Student from IIT Bombay just joined Google visit",
  "NVIDIA visit is 80% full",
  "Student from BITS Pilani joined Microsoft workshop",
  "New Adobe workshop just listed in Noida",
  "Flipkart supply chain visit threshold reached!",
]

function LiveActivityFeed() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % activities.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-[var(--border)] overflow-hidden">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </div>
      <div className="relative h-5 w-[280px] sm:w-[320px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-caption text-[var(--text-secondary)] absolute inset-0 truncate"
          >
            {activities[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Floating Visit Card ────────────────────────────────────────────────────────
function AnimatedVisitCard({ visit, delay, className }: { visit: typeof visits[0], delay: number, className?: string }) {
  const fillPercentage = Math.min((visit.seatsFilled / visit.seatsTotal) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute w-72 rounded-2xl bg-[var(--surface)]/80 backdrop-blur-xl border border-[var(--border)] p-5 shadow-2xl shadow-black/40 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-foreground font-bold border border-[var(--border)] shadow-inner">
            {visit.companyLogo}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{visit.companyName}</p>
            <p className="text-tiny text-[var(--text-muted)] flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {visit.location.split(',')[0]}
            </p>
          </div>
        </div>
        <div className="px-2 py-1 rounded-md bg-white/[0.05] text-tiny font-medium text-[var(--text-secondary)] border border-[var(--border)]">
          {formatCurrency(visit.fee)}
        </div>
      </div>
      
      <p className="text-caption text-[var(--text-secondary)] line-clamp-1 mb-4">
        {visit.title}
      </p>

      {/* Seat filling animation */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-tiny">
          <span className="text-[var(--text-muted)]">Seats filling fast</span>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 1 }}
            className="text-primary font-medium"
          >
            {Math.round(fillPercentage)}%
          </motion.span>
        </div>
        <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
            initial={{ width: "0%" }}
            animate={{ width: `${fillPercentage}%` }}
            transition={{ delay: delay + 0.5, duration: 1.5, ease: "easeOut" }}
          >
            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px]" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Animated City Connections ─────────────────────────────────────────────────
function ConnectionLines() {
  return (
    <svg className="absolute inset-0 w-full h-full -z-10" style={{ pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
          <stop offset="50%" stopColor="rgba(139, 92, 246, 0.4)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
        </linearGradient>
      </defs>
      
      {/* Line 1 */}
      <motion.path
        d="M 100 350 C 200 200, 300 400, 450 150"
        fill="transparent"
        stroke="url(#line-gradient)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
      />
      {/* Node 1 */}
      <motion.circle cx="100" cy="350" r="4" fill="#3b82f6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} />
      <motion.circle cx="450" cy="150" r="4" fill="#8b5cf6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.7 }} />

      {/* Line 2 */}
      <motion.path
        d="M 50 100 C 150 50, 250 250, 350 200"
        fill="transparent"
        stroke="url(#line-gradient)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
      />
      {/* Node 2 */}
      <motion.circle cx="50" cy="100" r="4" fill="#3b82f6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
      <motion.circle cx="350" cy="200" r="4" fill="#8b5cf6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5 }} />
    </svg>
  )
}

// ─── Trusted Companies Marquee ───────────────────────────────────────────────


export function Hero() {
  const featuredVisits = visits.filter(v => ['google', 'microsoft'].includes(v.companyId)).slice(0, 2)

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-24 pb-12">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 -z-20">
        {/* Deep background color */}
        <div className="absolute inset-0 bg-[#060609]" />
        
        {/* Animated glowing orbs */}
        <motion.div 
          className="absolute top-[15%] left-[20%] w-[600px] h-[600px] rounded-full bg-primary/[0.05] blur-[140px]"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-[120px]"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 40, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Fine dotted grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
        
        {/* Fade out edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060609] via-transparent to-[#060609]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10 flex-grow flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left Content */}
          <div className="max-w-2xl pt-10 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-8"
            >
              <LiveActivityFeed />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-foreground leading-[1.05]"
            >
              Don&apos;t wait for <br className="hidden sm:block" />
              opportunities. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent relative inline-block">
                Visit them.
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mt-8 text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-xl font-medium"
            >
              We aggregate student demand to organize exclusive visits to top tech companies. Connect with real engineers and kickstart your career.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link href="/visits" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium bg-foreground text-[var(--background)] rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                Browse upcoming visits
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-foreground bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.06] hover:border-white/20 transition-all">
                <Sparkles className="h-4 w-4 text-[var(--text-muted)]" />
                How it works
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Abstract Scene */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full perspective-[1000px] mt-10 lg:mt-0">
            <ConnectionLines />
            
            {/* The main subject card */}
            {featuredVisits[0] && (
              <AnimatedVisitCard 
                visit={featuredVisits[0]} 
                delay={0.5} 
                className="top-[5%] sm:top-[10%] right-[5%] sm:right-[15%] z-20 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-pointer w-64 sm:w-72" 
              />
            )}
            
            {/* Secondary card slightly behind */}
            {featuredVisits[1] && (
              <AnimatedVisitCard 
                visit={featuredVisits[1]} 
                delay={0.7} 
                className="bottom-[10%] sm:bottom-[20%] left-[0%] sm:left-[5%] z-10 scale-[0.85] sm:scale-90 opacity-80 hover:opacity-100 hover:z-30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)] transition-all duration-300 cursor-pointer w-64 sm:w-72" 
              />
            )}

            {/* Floating generic building abstract */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute top-[40%] sm:top-[45%] left-[40%] sm:left-[45%] h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md animate-[float_5s_ease-in-out_infinite]"
            >
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--text-muted)]" />
            </motion.div>
          </div>
        </div>
      </div>



      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
      `}</style>
    </section>
  )
}
