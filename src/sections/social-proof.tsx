"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Star, MapPin, Calendar, Building, ArrowRight } from "lucide-react"

// ─── Data Setup ─────────────────────────────────────────────────────────────

const topRowCompanies = [
  { id: 'google', name: "Google", visits: 14, location: "Bangalore AI Lab" },
  { id: 'microsoft', name: "Microsoft", visits: 9, location: "Azure Engineering Center" },
  { id: 'nvidia', name: "NVIDIA", visits: 3, location: "GPU Architecture Tour", status: "Almost Full" },
  { id: 'adobe', name: "Adobe", visits: 5, location: "Creative Cloud Campus" },
  { id: 'amazon', name: "Amazon", visits: 12, location: "Fulfillment Tech Center" },
  { id: 'intel', name: "Intel", visits: 4, location: "Hardware R&D" },
  { id: 'oracle', name: "Oracle", visits: 6, location: "Cloud Infrastructure" },
  { id: 'ibm', name: "IBM", visits: 7, location: "Quantum Lab" },
  { id: 'cisco', name: "Cisco", visits: 4, location: "Networking Campus" },
  { id: 'samsung', name: "Samsung", visits: 8, location: "R&D Institute" },
  { id: 'qualcomm', name: "Qualcomm", visits: 5, location: "5G Innovation Center" },
  { id: 'dell', name: "Dell", visits: 6, location: "Enterprise Tech" },
  { id: 'apple', name: "Apple", visits: 2, location: "Design Center" },
  { id: 'vercel', name: "Vercel", visits: 8, location: "Edge Network HQ" },
]

const bottomRowCompanies = [
  { id: 'amd', name: "AMD", visits: 4, location: "Ryzen Design Hub" },
  { id: 'meta', name: "Meta", visits: 7, location: "AR/VR Studios" },
  { id: 'salesforce', name: "Salesforce", visits: 5, location: "Tower India" },
  { id: 'spotify', name: "Spotify", visits: 3, location: "Audio Engineering Lab" },
  { id: 'netflix', name: "Netflix", visits: 2, location: "Streaming Tech Center", status: "Almost Full" },
  { id: 'uber', name: "Uber", visits: 6, location: "Mobility Engineering" },
  { id: 'atlassian', name: "Atlassian", visits: 4, location: "Jira Dev Center" },
  { id: 'paytm', name: "Paytm", visits: 10, location: "Fintech HQ" },
  { id: 'razorpay', name: "Razorpay", visits: 8, location: "Payments Campus" },
  { id: 'swiggy', name: "Swiggy", visits: 9, location: "Logistics Hub" },
  { id: 'zomato', name: "Zomato", visits: 11, location: "FoodTech Center" },
  { id: 'flipkart', name: "Flipkart", visits: 15, location: "E-Commerce Valley" },
  { id: 'stripe', name: "Stripe", visits: 4, location: "Fintech Campus" },
  { id: 'notion', name: "Notion", visits: 6, location: "Product Studio" },
]

// ─── Sub-Components ─────────────────────────────────────────────────────────

function AnimatedCounter({ end, suffix = "", duration = 2, delay = 0 }: { end: number, suffix?: string, duration?: number, delay?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      let animationFrame: number

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime - (delay * 1000)
        
        if (elapsed < 0) {
          animationFrame = requestAnimationFrame(animate)
          return
        }

        const progress = Math.min(elapsed / (duration * 1000), 1)
        const easeProgress = 1 - Math.pow(1 - progress, 4) // easeOutQuart
        setCount(Math.floor(easeProgress * end))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        } else {
          setCount(end)
        }
      }
      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }
  }, [isInView, end, duration, delay])

  return <span ref={ref}>{count}{suffix}</span>
}

function LogoCard({ company }: { company: any }) {
  return (
    <div className="relative group/card flex-shrink-0 flex items-center justify-center w-40 h-20 mx-4 cursor-pointer">
      
      {/* Tooltip */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 pointer-events-none z-50 transform translate-y-2 group-hover/card:translate-y-0">
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl min-w-[200px]">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-white/70" />
            <span className="text-sm font-semibold text-white tracking-wide">{company.name}</span>
          </div>
          <div className="h-px w-full bg-white/10 my-0.5" />
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{company.visits} Upcoming Visits</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            <span className="truncate">{company.location}</span>
          </div>
        </div>
        {/* Tooltip Triangle */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/10 backdrop-blur-xl border-r border-b border-white/10 rotate-45" />
      </div>

      {/* Logo Image */}
      <motion.div 
        className="relative w-20 h-8 md:w-28 md:h-12 flex items-center justify-center opacity-60 transition-opacity duration-300 group-hover/card:opacity-100"
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Image 
          src={`/logos/${company.id}.svg`} 
          alt={`${company.name} logo`}
          fill
          className="object-contain drop-shadow-md group-hover/card:drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300"
        />
      </motion.div>
    </div>
  )
}

// ─── Main Section ───────────────────────────────────────────────────────────

export function SocialProof() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#0a0a0f]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(66,133,244,0.03),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
              ))}
            </div>
            <span className="text-xs font-medium text-white/80 ml-1">4.9/5 Student Rating</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-medium text-white/60 tracking-tight"
          >
            Trusted by students visiting<br/>
            <span className="text-white">India&apos;s leading technology companies</span>
          </motion.h2>
        </div>

        {/* Marquee Section */}
        <div className="relative py-12 my-12">
          {/* Fade Masks */}
          <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent z-20 pointer-events-none" />

          {/* Top Row (Right to Left) */}
          <div className="flex overflow-hidden group mb-6">
            <div className="flex whitespace-nowrap animate-marquee-rtl group-hover:[animation-play-state:paused]">
              {/* Quadruple array to ensure seamless infinite scroll with higher density */}
              {[...topRowCompanies, ...topRowCompanies, ...topRowCompanies, ...topRowCompanies].map((company, i) => (
                <LogoCard key={`top-${i}`} company={company} />
              ))}
            </div>
          </div>

          {/* Bottom Row (Left to Right, 30% slower -> 78s) */}
          <div className="flex overflow-hidden group">
            <div className="flex whitespace-nowrap animate-marquee-ltr group-hover:[animation-play-state:paused]">
              {[...bottomRowCompanies, ...bottomRowCompanies, ...bottomRowCompanies, ...bottomRowCompanies].map((company, i) => (
                <LogoCard key={`bottom-${i}`} company={company} />
              ))}
            </div>
          </div>
        </div>

        {/* Subtle Separator */}
        <div className="relative w-full max-w-4xl mx-auto h-px my-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <motion.div 
            className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 5, ease: "linear", repeat: Infinity }}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 max-w-4xl mx-auto border-t border-white/5 pt-16">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-3">
              <AnimatedCounter end={2400} suffix="+" duration={2.5} />
            </span>
            <span className="text-sm font-medium text-white/50 uppercase tracking-wider">Students Joined</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-3">
              <AnimatedCounter end={180} suffix="+" duration={2.5} delay={0.1} />
            </span>
            <span className="text-sm font-medium text-white/50 uppercase tracking-wider">Company Visits</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-3">
              <AnimatedCounter end={50} suffix="+" duration={2.5} delay={0.2} />
            </span>
            <span className="text-sm font-medium text-white/50 uppercase tracking-wider">Partner Companies</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-3">
              <AnimatedCounter end={92} suffix="%" duration={2.5} delay={0.3} />
            </span>
            <span className="text-sm font-medium text-white/50 uppercase tracking-wider">Success Rate</span>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 md:mt-24 flex flex-col items-center justify-center text-center">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#0a0a0f] rounded-full font-semibold text-lg overflow-hidden transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
          >
            <span>Explore Company Visits</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-sm text-white/40 font-medium tracking-wide"
          >
            New company visits are added every week.
          </motion.span>
        </div>

      </div>
    </section>
  )
}
