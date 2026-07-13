"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, FileText, GraduationCap, IndianRupee, Clock, CheckCircle2, TrendingUp, BarChart3, Settings } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { ActivityTimeline, type TimelineEvent } from "@/components/admin/activity-timeline";

const iconMap: Record<string, React.ElementType> = {
  Building2, MapPin, FileText, GraduationCap, IndianRupee, Clock, CheckCircle2, TrendingUp, BarChart3, Settings,
};

type StatData = {
  label: string;
  value: number | string;
  icon: string;
  glowClass: string;
  accentColor: string;
};

type QuickAction = {
  label: string;
  href: string;
  icon: string;
  color: string;
  iconColor: string;
};

export function DashboardClient({
  greeting,
  userName,
  stats,
  quickActions,
  timelineEvents,
  pendingApplications,
}: {
  greeting: string;
  userName: string;
  stats: StatData[];
  quickActions: QuickAction[];
  timelineEvents: TimelineEvent[];
  pendingApplications: number;
}) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-br from-blue-500/[0.07] via-purple-500/[0.04] to-transparent p-8 md:p-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-60 h-60 bg-purple-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative">
          <motion.h1
            className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-50"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {greeting},{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {userName}
            </span>
          </motion.h1>
          <motion.p
            className="mt-2 text-sm text-zinc-500 max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Here&apos;s what&apos;s happening across your platform today.
          </motion.p>

          {pendingApplications > 0 && (
            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Link
                href="/admin/applications?status=PENDING"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-sm font-medium text-amber-400 hover:bg-amber-500/15 transition-colors"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                {pendingApplications} pending application{pendingApplications !== 1 ? "s" : ""} to review
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = iconMap[stat.icon] || Building2;
          return (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={Icon}
              glowClass={stat.glowClass}
              accentColor={stat.accentColor}
              delay={i * 0.05}
            />
          );
        })}
      </div>

      {/* Quick Actions + Timeline row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Quick Actions */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Quick Actions
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, i) => {
              const Icon = iconMap[action.icon] || Building2;
              return (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    className={`group relative flex items-center gap-3 rounded-xl border border-white/[0.04] bg-gradient-to-br ${action.color} p-4 transition-all hover:border-white/[0.08]`}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.04, duration: 0.3 }}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ${action.iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200">{action.label}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Recent Activity
            </h2>
            <Link
              href="/admin/applications"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="rounded-xl border border-white/[0.04] bg-[#12121a] p-3 max-h-[340px] overflow-y-auto admin-scrollbar">
            {timelineEvents.length > 0 ? (
              <ActivityTimeline events={timelineEvents} />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Clock className="h-8 w-8 text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-500">No recent activity</p>
                <p className="text-xs text-zinc-700 mt-1">Activity will appear here as events occur</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
