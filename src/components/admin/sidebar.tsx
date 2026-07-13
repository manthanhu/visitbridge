"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  FileText,
  GraduationCap,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: "",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Companies", href: "/admin/companies", icon: Building2 },
      { label: "Visits", href: "/admin/visits", icon: MapPin },
      { label: "Applications", href: "/admin/applications", icon: FileText },
      { label: "Students", href: "/admin/students", icon: GraduationCap },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function AdminSidebar({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 z-40 admin-sidebar admin-scrollbar",
        "bg-[#0c0c14] border-r border-white/[0.04]",
      )}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.04]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              className="flex items-center gap-2.5 overflow-hidden"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-100 tracking-tight leading-none">
                  VisitBridge
                </span>
                <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase mt-0.5">
                  Admin
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="flex h-8 w-8 mx-auto shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Workspace selector */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] px-3 py-2 hover:bg-white/[0.05] transition-colors cursor-pointer">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-500/10 text-blue-400 text-xs font-bold">
              V
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-300 truncate">VisitBridge Prod</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 admin-scrollbar">
        {navSections.map((section, si) => (
          <div key={si} className={cn(si > 0 && "mt-5")}>
            {section.title && !collapsed && (
              <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-zinc-600 px-2.5 mb-2">
                {section.title}
              </p>
            )}
            {section.title && collapsed && si > 0 && (
              <div className="mx-3 mb-2 h-px bg-white/[0.04]" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                        active
                          ? "text-zinc-50 bg-white/[0.06]"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]",
                        collapsed && "justify-center px-0"
                      )}
                      whileHover={{ x: active ? 0 : 2 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-blue-500"
                          layoutId="sidebar-active"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}

                      <item.icon
                        className={cn(
                          "shrink-0 transition-colors",
                          active ? "text-blue-400" : "text-zinc-600 group-hover:text-zinc-400",
                          collapsed ? "h-5 w-5" : "h-4 w-4"
                        )}
                      />

                      <AnimatePresence mode="wait">
                        {!collapsed && (
                          <motion.span
                            className="truncate"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {item.badge !== undefined && !collapsed && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500/10 px-1.5 text-[10px] font-semibold text-blue-400">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 py-3 border-t border-white/[0.04] space-y-1">
        {/* User */}
        {!collapsed && userName && (
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 mb-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xs font-bold text-blue-300 ring-1 ring-white/[0.06]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-300 truncate">{userName}</p>
              <p className="text-[10px] text-zinc-600">Administrator</p>
            </div>
          </div>
        )}

        <Link href="/dashboard">
          <motion.div
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-colors",
              collapsed && "justify-center px-0"
            )}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
          >
            <LogOut className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
            {!collapsed && <span>Exit Admin</span>}
          </motion.div>
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 border border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors shadow-lg"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </motion.aside>
  );
}
