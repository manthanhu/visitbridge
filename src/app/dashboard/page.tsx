"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, User } from "lucide-react";

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
    return null; // Middleware will redirect, but just in case
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                VisitBridge
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="text-sm">
                Go to Landing Page
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleSignOut} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back, {session.user.name?.split(" ")[0] || "User"}! 👋
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            You have successfully authenticated into VisitBridge.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Your Profile
            </h3>
            <div className="mt-2 flex flex-col gap-1 text-sm text-zinc-500 dark:text-zinc-400">
              <p>Name: <span className="font-medium text-zinc-900 dark:text-zinc-300">{session.user.name}</span></p>
              <p>Email: <span className="font-medium text-zinc-900 dark:text-zinc-300">{session.user.email}</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
