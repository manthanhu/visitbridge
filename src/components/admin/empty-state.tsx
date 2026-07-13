"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.04]">
          <Icon className="h-7 w-7 text-zinc-600" />
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500/20" />
        <div className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-purple-500/20" />
      </div>

      <h3 className="text-base font-semibold text-zinc-300 mb-1.5">{title}</h3>
      <p className="text-sm text-zinc-600 text-center max-w-xs mb-6">{description}</p>

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <motion.button
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/10"
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            {actionLabel}
          </motion.button>
        </Link>
      )}
    </motion.div>
  );
}
