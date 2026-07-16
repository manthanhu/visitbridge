"use client"

import Link from "next/link"
import { useState } from "react"
import emailjs from "@emailjs/browser"
import { ExternalLink, Globe, MessageCircle, Mail, Loader2, CheckCircle2 } from "lucide-react"

const footerLinks = {
  platform: [
    { label: "Browse Visits", href: "/visits" },
    { label: "Companies", href: "/companies" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "How it Works", href: "/#how-it-works" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/maintenance" },
    { label: "Careers", href: "/maintenance" },
    { label: "Press Kit", href: "/maintenance" },
  ],
  support: [
    { label: "Help Center", href: "/maintenance" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/maintenance" },
    { label: "Terms of Service", href: "/maintenance" },
  ],
}

const socials = [
  { icon: <ExternalLink className="h-4 w-4" />, href: "#", label: "External Link" },
  { icon: <Globe className="h-4 w-4" />, href: "#", label: "Website" },
  { icon: <Mail className="h-4 w-4" />, href: "#", label: "Email" },
  { icon: <MessageCircle className="h-4 w-4" />, href: "#", label: "Discord" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus("loading")
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_nv7lbfm";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

      if (templateId === "YOUR_TEMPLATE_ID" || publicKey === "YOUR_PUBLIC_KEY") {
        // Mock subscription if keys are not provided yet
        setTimeout(() => {
          setStatus("success")
          setEmail("")
          setTimeout(() => setStatus("idle"), 3000)
        }, 1000)
        return
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          subscriber_email: email,
        },
        publicKey
      );

      setStatus("success")
      setEmail("")
      setTimeout(() => setStatus("idle"), 3000)
    } catch (error) {
      setErrorMessage((error as { text?: string })?.text || "Failed to subscribe")
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <footer className="relative bg-gradient-to-b from-[var(--background)] to-[var(--surface)] overflow-hidden">
      {/* Top subtle border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 lg:gap-12 py-16 md:py-20 lg:py-24">
          
          {/* Brand & Newsletter */}
          <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-5 pr-0 lg:pr-12 text-center sm:text-left flex flex-col sm:block items-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-shadow duration-300">
                <span className="text-base font-bold text-white">VB</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground">VisitBridge</span>
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Bridging Campus & Corporate</span>
              </div>
            </Link>
            
            <p className="text-body text-[var(--text-secondary)] mt-6 mb-8 max-w-md leading-relaxed mx-auto sm:mx-0">
              We connect ambitious students with the companies they want to work for through organized, high-impact office visits.
            </p>

            {/* Newsletter Input */}
            <form onSubmit={handleSubscribe} className="relative w-full max-w-md group mx-auto sm:mx-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative flex flex-col sm:flex-row gap-2 p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl focus-within:border-primary/50 transition-colors">
                <div className="hidden sm:flex pl-3 items-center justify-center text-[var(--text-muted)]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Subscribe to newsletter"
                  required
                  className="flex-1 h-12 sm:h-10 px-4 sm:px-2 text-sm bg-transparent text-foreground placeholder:text-[var(--text-muted)] focus:outline-none text-center sm:text-left w-full"
                />
                <button 
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="h-12 sm:h-10 px-6 w-full sm:w-auto text-sm font-bold bg-white text-black rounded-lg hover:bg-white/90 disabled:opacity-80 disabled:cursor-not-allowed transition-colors flex-shrink-0 flex items-center justify-center gap-2"
                >
                  {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {status === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  {status === "idle" && "Subscribe"}
                  {status === "success" && "Subscribed!"}
                  {status === "error" && "Failed"}
                </button>
              </div>
              {status === "error" && (
                <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-red-500 font-medium">
                  {errorMessage}
                </p>
              )}
            </form>
          </div>

          {/* Links */}
          <div className="col-span-1 lg:col-span-2 lg:col-start-7">
            <h4 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group relative text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors inline-block">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group relative text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors inline-block">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-2 mt-2 lg:mt-0">
            <h4 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider">Support</h4>
            <ul className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="group relative text-sm text-[var(--text-secondary)] hover:text-foreground transition-colors inline-block">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 py-8 mt-4">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
          
          <p className="text-sm text-[var(--text-muted)] font-medium">
            © {new Date().getFullYear()} VisitBridge. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="group h-10 w-10 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:bg-primary/10 hover:border-primary/20 hover:scale-110 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
