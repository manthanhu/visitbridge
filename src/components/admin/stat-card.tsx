"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  glowClass?: string;
  accentColor?: string;
  delay?: number;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  glowClass = "stat-glow-blue",
  accentColor = "text-blue-400 bg-blue-500/10",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative rounded-xl border border-white/[0.04] bg-[#12121a] p-5 transition-all hover:border-white/[0.08]",
        glowClass,
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl border border-blue-500/10" />
      </div>

      <div className="relative flex items-start justify-between mb-4">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
            accentColor,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {trend && (
          <div
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
              trend.positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400",
            )}
          >
            <span>{trend.positive ? "↑" : "↓"}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-zinc-50 tracking-tight animate-count-up">
          {value}
        </p>
        <p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-wider">
          {label}
        </p>
      </div>

      {/* Sparkline placeholder (subtle bar) */}
      <div className="mt-4 flex items-end gap-[3px] h-6">
        {[35, 55, 42, 68, 52, 74, 60, 82, 70, 90].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm bg-white/[0.04] group-hover:bg-blue-500/10 transition-colors"
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.5, delay: delay + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
    </motion.div>
  );
}
