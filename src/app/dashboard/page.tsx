import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LogOut, LayoutDashboard, User, Briefcase, GraduationCap, ChevronRight, CheckCircle2, MapPin } from "lucide-react";
import SignOutButton from "./sign-out-button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/sign-in");
  }

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!studentProfile) {
    redirect("/onboarding");
  }

  // Fetch applications
  const applications = await prisma.visit_requests.findMany({
    where: { studentId: studentProfile.id },
    include: {
      company_visits: {
        include: { companies: true },
      },
    },
    orderBy: { appliedAt: "desc" },
    take: 3,
  });

  // Calculate stats
  const activeApplications = await prisma.visit_requests.count({
    where: { 
      studentId: studentProfile.id,
      status: { in: ["PENDING", "APPROVED", "WAITLISTED"] }
    },
  });

  const upcomingVisits = await prisma.company_visits.count({
    where: { 
      published: true, 
      deletedAt: null,
      scheduledDate: { gte: new Date() }
    },
  });

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
            <Link href="/profile" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 flex items-center">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
            <SignOutButton />
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
          {(session.user as any).role === "ADMIN" && (
            <Link href="/admin" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors">
              Admin Panel
            </Link>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Action Card */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
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
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{activeApplications}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Available Visits</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{upcomingVisits}</p>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            {applications.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Applications</h3>
                </div>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                          {app.company_visits.companies.logoUrl ? (
                            <img src={app.company_visits.companies.logoUrl} alt="" className="w-6 h-6 object-contain" />
                          ) : (
                            <Briefcase className="h-5 w-5 text-zinc-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">
                            <Link href={`/visits/${app.company_visits.slug || app.company_visits.id}`} className="hover:text-blue-500 transition-colors">
                              {app.company_visits.title}
                            </Link>
                          </p>
                          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                            <span>{app.company_visits.companies.name}</span>
                            {app.company_visits.city && (
                              <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {app.company_visits.city}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={
                        app.status === "APPROVED" ? "border-emerald-500/50 text-emerald-500 dark:text-emerald-400" :
                        app.status === "REJECTED" ? "border-red-500/50 text-red-500 dark:text-red-400" :
                        app.status === "CANCELLED" ? "border-zinc-500/50 text-zinc-500 dark:text-zinc-400" :
                        "border-blue-500/50 text-blue-500 dark:text-blue-400"
                      }>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Links */}
          <div className="space-y-4">
            <Link href="/visits" className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10">
                  <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-50">Opportunities</h4>
                  <p className="text-xs text-zinc-500">Browse visits & placements</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400 group-hover:text-purple-500 transition-colors" />
            </Link>

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
