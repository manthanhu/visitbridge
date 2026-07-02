"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, User, Briefcase, Settings, GraduationCap, ChevronRight, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          router.refresh();
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isProfileComplete = (session.user as any).isProfileComplete;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                VisitBridge
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" className="text-zinc-600 dark:text-zinc-300">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back, {session.user.name?.split(" ")[0] || "Student"}
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Here is an overview of your campus placements and industrial visits.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Action Card */}
          <div className="md:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Profile Status: 100% Complete
                </h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Your profile is fully complete and visible to companies. You are now eligible to apply for industrial visits, workshops, and placement drives.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Applications</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">0</p>
              </div>
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Upcoming Visits</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">0</p>
              </div>
            </div>
          </div>

          {/* Side Links */}
          <div className="space-y-4">
            <Link href="/profile" className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-50">My Profile</h4>
                  <p className="text-xs text-zinc-500">View and edit details</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
            </Link>

            <div className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm opacity-60 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Briefcase className="h-5 w-5 text-zinc-500" />
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-50">Opportunities</h4>
                  <p className="text-xs text-zinc-500">Coming soon</p>
                </div>
              </div>
            </div>

            <div className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm opacity-60 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <GraduationCap className="h-5 w-5 text-zinc-500" />
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-50">Certificates</h4>
                  <p className="text-xs text-zinc-500">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
