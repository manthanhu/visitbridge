"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopNavbar } from "@/components/admin/top-navbar";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function AdminShell({
  children,
  userName,
  userImage,
}: {
  children: React.ReactNode;
  userName?: string;
  userImage?: string | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Desktop sidebar */}
      <AdminSidebar userName={userName} />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 z-50 h-screen w-72 md:hidden"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="relative h-full">
                <AdminSidebar userName={userName} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopNavbar
          userName={userName}
          userImage={userImage}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
