"use client";

import { ReactNode } from "react";
import { AuthPanel } from "./auth-panel";
import { motion } from "framer-motion";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      <AuthPanel />
      
      <div className="flex w-full items-center justify-center p-4 lg:w-1/2 lg:p-12 xl:p-24">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
