"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type LucideIcon, FileText, Building2, Users, CheckCircle2, XCircle, Clock } from "lucide-react";

export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "company" | "visit" | "application" | "approval" | "rejection" | "general";
};

const typeConfig: Record<TimelineEvent["type"], { icon: LucideIcon; color: string; bg: string }> = {
  company: { icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10" },
  visit: { icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10" },
  application: { icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
  approval: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  rejection: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  general: { icon: Users, color: "text-zinc-400", bg: "bg-zinc-500/10" },
};

export function ActivityTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) return null;

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-6 bottom-6 w-px bg-white/[0.04]" />

      <div className="space-y-1">
        {events.map((event, i) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={event.id}
              className="group relative flex items-start gap-3.5 rounded-lg p-2.5 hover:bg-white/[0.02] transition-colors"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2 ring-[#0a0a0f]",
                  config.bg,
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", config.color)} />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-medium text-zinc-300 truncate">{event.title}</p>
                <p className="text-xs text-zinc-600 mt-0.5 truncate">{event.description}</p>
              </div>

              <span className="text-[10px] text-zinc-600 shrink-0 pt-1 tabular-nums">
                {event.time}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
