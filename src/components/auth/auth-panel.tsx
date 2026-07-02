"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

const quotes = [
  {
    text: "Visited Google → Internship → PPO",
    author: "Rahul S., Software Engineer",
  },
  {
    text: "Visited NVIDIA → Research Internship",
    author: "Priya M., AI Researcher",
  },
  {
    text: "Turn industrial visits into opportunities.",
    author: "VisitBridge Community",
  },
];

export function AuthPanel() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative hidden w-full flex-col items-center justify-center overflow-hidden bg-zinc-950 lg:flex">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="noise-bg absolute inset-0 opacity-[0.03]"></div>
        <div className="animated-grid absolute inset-0 opacity-[0.03]"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/4 -left-1/4 h-[800px] w-[800px] rounded-full bg-blue-500/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex h-full w-full max-w-lg flex-col justify-between p-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            VisitBridge
          </span>
        </Link>

        {/* Dynamic Quotes */}
        <div className="flex flex-col gap-6">
          <h1 className="text-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Your next career starts here.
          </h1>

          <div className="relative h-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <p className="text-xl font-medium text-zinc-300">
                  "{quotes[currentQuote].text}"
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  {quotes[currentQuote].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} VisitBridge</span>
          <span>•</span>
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
