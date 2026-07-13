"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, ChevronRight, Menu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  const labelMap: Record<string, string> = {
    admin: "Admin",
    companies: "Companies",
    visits: "Visits",
    applications: "Applications",
    students: "Students",
    settings: "Settings",
    new: "New",
    edit: "Edit",
    dashboard: "Dashboard",
  };

  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = labelMap[seg] || (seg.length > 12 ? `${seg.slice(0, 8)}…` : seg);
    crumbs.push({ label, href: path });
  }

  return crumbs;
}

export function AdminTopNavbar({
  userName,
  userImage,
  onMobileMenuToggle,
}: {
  userName?: string;
  userImage?: string | null;
  onMobileMenuToggle?: () => void;
}) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="admin-glass border-b border-white/[0.04]">
        <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
          {/* Left: Mobile menu + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mobile logo */}
            <div className="md:hidden flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-zinc-100">VisitBridge</span>
            </div>

            {/* Breadcrumbs (desktop) */}
            <nav className="hidden md:flex items-center gap-1 text-sm min-w-0" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <div key={crumb.href} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-zinc-200 truncate">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors truncate"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right: Search, notifications, avatar */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] transition-colors"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search…</span>
              <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-white/[0.06] bg-white/[0.03] px-1.5 font-mono text-[10px] text-zinc-600">
                ⌘K
              </kbd>
            </button>

            {/* Notifications */}
            <button
              className="relative flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 pulse-dot" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-white/[0.06] mx-1 hidden sm:block" />

            {/* User avatar */}
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-1 hover:bg-white/[0.03] transition-colors cursor-pointer">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName || "Admin"}
                  className="h-7 w-7 rounded-full ring-1 ring-white/[0.06] object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-xs font-bold text-blue-300 ring-1 ring-white/[0.06]">
                  {userName?.charAt(0).toUpperCase() || "A"}
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-zinc-300">
                {userName?.split(" ")[0] || "Admin"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
