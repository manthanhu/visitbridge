"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"


const navLinks = [
  { label: "Visits", href: "/visits" },
  { label: "Companies", href: "/companies" },
  { label: "Dashboard", href: "/dashboard" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">VB</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                VisitBridge
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors rounded-lg hover:bg-white/[0.04]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors">
                Sign in
              </button>
              <button className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Get Started
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
        </div>

        {/* Backdrop blur bar */}
        <div className="absolute inset-0 -z-10 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]" />
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-40 md:hidden bg-[var(--background)] flex flex-col pt-24 px-6 pb-6"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-2 mt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-4 text-2xl font-medium text-[var(--text-secondary)] hover:text-foreground hover:bg-white/[0.04] rounded-xl transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="pt-6 border-t border-[var(--border)] mt-auto space-y-4">
                  <button className="w-full px-4 py-4 text-lg font-medium text-[var(--text-secondary)] hover:text-foreground text-left rounded-xl hover:bg-white/[0.04] transition-colors">
                    Sign in
                  </button>
                  <button className="w-full px-4 py-4 text-lg font-bold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-between shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
