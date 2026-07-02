"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthFormCardProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function AuthFormCard({ children, title, description }: AuthFormCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex w-full max-w-md flex-col gap-8 rounded-2xl bg-white p-8 shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)] ring-1 ring-zinc-200/50 sm:p-10 dark:bg-zinc-950 dark:ring-zinc-800/50"
    >
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      {children}
    </motion.div>
  );
}
