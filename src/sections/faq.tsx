"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUp, stagger, viewportOnce } from "@/lib/animations"
import { faqs } from "@/data/faq"
import { Plus, MessageSquare } from "lucide-react"

function FAQItem({ item, isOpen, onClick }: { item: typeof faqs[0], isOpen: boolean, onClick: () => void }) {
  return (
    <div 
      className={`group relative overflow-hidden transition-all duration-300 ${
        isOpen ? "bg-white/[0.03]" : "hover:bg-white/[0.01]"
      }`}
    >
      {/* Left accent border */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300 ${
          isOpen 
            ? "bg-gradient-to-b from-primary to-accent opacity-100" 
            : "bg-primary opacity-0 group-hover:opacity-30"
        }`} 
      />
      
      {/* Bottom border (acts as separator) */}
      <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-[var(--border)] group-last:hidden" />

      <button
        onClick={onClick}
        className="flex items-start justify-between w-full px-5 py-5 sm:px-6 lg:px-8 sm:py-6 lg:py-7 text-left"
        aria-expanded={isOpen}
      >
        <span className={`text-base lg:text-lg font-medium pr-8 transition-colors duration-300 ${isOpen ? "text-primary" : "text-foreground group-hover:text-foreground/90"}`}>
          {item.question}
        </span>
        <span className="mt-1 flex-shrink-0">
          <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? "bg-primary/10 border-primary/20 text-primary rotate-45" 
              : "bg-white/[0.03] border-[var(--border)] text-[var(--text-muted)] group-hover:bg-white/[0.06] group-hover:text-foreground"
          }`}>
            <Plus className="h-3.5 w-3.5" />
          </div>
        </span>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="px-5 sm:px-6 lg:px-8 pb-5 sm:pb-7 text-body text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null)

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-20 items-start">
            {/* Left */}
            <motion.div variants={fadeUp} className="sticky top-32">
              <p className="text-label text-primary mb-4 tracking-widest uppercase">FAQ</p>
              <h2 className="text-display text-foreground mb-6">
                Questions? We&apos;ve got <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">answers.</span>
              </h2>
              <p className="text-body-lg text-[var(--text-secondary)] mb-10">
                Everything you need to know about VisitBridge. Can&apos;t find what you&apos;re looking for? Reach out to our team.
              </p>
              
              <button className="group relative inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-white/[0.03] border border-[var(--border)] hover:bg-white/[0.06] hover:border-primary/50 text-foreground transition-all duration-300 shadow-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="font-medium relative z-10">Contact support</span>
              </button>
            </motion.div>

            {/* Right — Accordion */}
            <motion.div variants={fadeUp} className="relative group/accordion">
              {/* Glass background */}
              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl opacity-0 group-hover/accordion:opacity-100 transition-opacity duration-700 blur-[2px] -z-10" />
              
              <div className="rounded-3xl bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] overflow-hidden shadow-2xl shadow-black/40">
                {faqs.map((faq) => (
                  <FAQItem 
                    key={faq.id} 
                    item={faq} 
                    isOpen={openId === faq.id}
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
