"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger, viewportOnce, scaleIn } from "@/lib/animations"
import { Building2, Users, Rocket, Target, Zap, Globe2 } from "lucide-react"

const values = [
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Community First",
    description: "We believe in the power of connections. By bringing students and industry leaders together, we create a thriving ecosystem for growth."
  },
  {
    icon: <Building2 className="h-6 w-6 text-accent" />,
    title: "Bridging the Gap",
    description: "Our mission is to eliminate the divide between academic learning and real-world corporate experience through immersive visits."
  },
  {
    icon: <Rocket className="h-6 w-6 text-emerald-500" />,
    title: "Career Acceleration",
    description: "We don't just provide tours; we offer stepping stones for students to accelerate their career trajectories and find their passion."
  },
  {
    icon: <Target className="h-6 w-6 text-rose-500" />,
    title: "Purpose Driven",
    description: "Every visit is meticulously planned to ensure maximum value, providing actionable insights into modern industry practices."
  },
  {
    icon: <Zap className="h-6 w-6 text-amber-500" />,
    title: "Innovation Focused",
    description: "We partner with forward-thinking companies that are shaping the future, giving students a front-row seat to innovation."
  },
  {
    icon: <Globe2 className="h-6 w-6 text-indigo-500" />,
    title: "Expanding Horizons",
    description: "By stepping outside the classroom, we help students expand their worldview and discover possibilities they never knew existed."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden pt-20">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      
      {/* Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20 md:mb-32"
          variants={stagger(0.1)}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Our Story
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Bridging the gap between <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Campus</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Corporate</span>.
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
            VisitBridge was founded with a simple yet powerful idea: students need more than just textbooks to succeed in the modern professional world. We organize high-impact industrial visits to help the next generation of talent connect with industry leaders.
          </motion.p>
        </motion.div>

        {/* Mission Banner */}
        <motion.div 
          className="relative rounded-3xl overflow-hidden mb-20 md:mb-32"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-gradient-x" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-[var(--card)]/80" />
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />
          
          <div className="relative p-10 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] italic leading-relaxed">
              "To democratize access to industry exposure, empowering every student with the real-world insights and connections they need to launch a successful career."
            </p>
          </div>
        </motion.div>

        {/* Core Values */}
        <div className="mb-20">
          <motion.div 
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              These principles guide everything we do, from selecting partner companies to organizing the smallest details of a visit.
            </p>
          </motion.div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {values.map((value, idx) => (
              <motion.div 
                key={idx}
                variants={fadeUp}
                className="group relative bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)] rounded-2xl p-8 hover:bg-white/[0.02] transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </main>
    </div>
  )
}
