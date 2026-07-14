import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  LogOut, LayoutDashboard, User, Briefcase, 
  GraduationCap, ChevronRight, CheckCircle2, 
  MapPin, Calendar, Clock, Star, Bell, 
  Activity, ArrowRight, ShieldCheck, Heart, FileText, Download, Building2
} from "lucide-react";
import SignOutButton from "./sign-out-button";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";

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

  const upcomingVisits = await prisma.company_visits.findMany({
    where: { 
      published: true, 
      deletedAt: null,
      scheduledDate: { gte: new Date() }
    },
    include: { companies: true },
    orderBy: { scheduledDate: "asc" },
    take: 4,
  });

  const completedVisitsCount = await prisma.visit_requests.count({
    where: {
      studentId: studentProfile.id,
      company_visits: { status: "COMPLETED" },
      status: "APPROVED"
    }
  });

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const firstName = session.user.name?.split(" ")[0] || "Student";

  // Calculate profile completion accurately (mocked out as 100% since they passed onboarding for now)
  const completionRate = 100;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      {/* Premium Navbar */}
      <nav className="border-b border-[var(--border)] bg-black/40 sticky top-0 z-50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                VisitBridge
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
              <Link href="/visits" className="hover:text-foreground transition-colors">Opportunities</Link>
              <Link href="/dashboard/applications" className="hover:text-foreground transition-colors">Applications</Link>
            </div>
            <div className="h-4 w-px bg-[var(--border)] hidden md:block" />
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            </Link>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-black to-accent/5 border border-[var(--border)] mb-10 p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{firstName}</span> 👋
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-xl">
                Ready for your next big opportunity? You have <strong className="text-foreground">{activeApplications} active applications</strong> and {upcomingVisits.length} upcoming visits available.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/visits">
                  <button className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    Browse New Visits <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                {(session.user as any).role === "ADMIN" && (
                  <Link href="/admin">
                    <button className="h-11 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-foreground font-semibold text-sm transition-colors flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Admin Panel
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Profile Completion Ring */}
            <div className="shrink-0 flex items-center gap-6 bg-black/40 backdrop-blur-md border border-[var(--border)] p-6 rounded-2xl">
              <div className="relative h-20 w-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                  <circle 
                    cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * completionRate) / 100}
                    className="text-emerald-500 transition-all duration-1000 ease-out" 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-bold text-foreground">{completionRate}%</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  Profile Complete <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1 max-w-[150px]">
                  You are eligible to apply for top company visits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Active Applications", value: activeApplications, icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Upcoming Visits", value: upcomingVisits.length, icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10" },
            { label: "Completed Visits", value: completedVisitsCount, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Companies Followed", value: studentProfile.dreamCompanies?.length || 0, icon: Heart, color: "text-rose-400", bg: "bg-rose-500/10" },
          ].map((stat, i) => (
            <div key={i} className="bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)] p-5 rounded-2xl hover:bg-[var(--card)] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* UPCOMING VISITS */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Available Opportunities
                </h2>
                <Link href="/visits" className="text-sm font-medium text-primary hover:underline">View All</Link>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {upcomingVisits.length > 0 ? (
                  upcomingVisits.map((visit) => (
                    <Link key={visit.id} href={`/visits/${visit.slug || visit.id}`}>
                      <div className="group relative bg-[var(--card)]/40 hover:bg-[var(--card)] border border-[var(--border)] hover:border-primary/50 p-5 rounded-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className="h-12 w-12 rounded-xl bg-black border border-[var(--border)] flex items-center justify-center p-2">
                            {visit.companies.logoUrl ? (
                              <img src={visit.companies.logoUrl} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <Building2 className="h-6 w-6 text-zinc-500" />
                            )}
                          </div>
                          <Badge className="bg-blue-500/10 text-blue-400 border-transparent group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            {visit.availableSeats} seats left
                          </Badge>
                        </div>
                        
                        <div className="relative z-10 flex-1">
                          <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{visit.title}</h3>
                          <p className="text-sm text-[var(--text-secondary)] mb-4">{visit.companies.name}</p>
                          
                          <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-muted)] mt-auto">
                            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {visit.city || "TBA"}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {visit.scheduledDate ? format(new Date(visit.scheduledDate), "MMM d") : "TBA"}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 bg-[var(--card)]/40 border border-dashed border-[var(--border)] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-[var(--border)] flex items-center justify-center mb-3">
                      <MapPin className="h-5 w-5 text-[var(--text-muted)]" />
                    </div>
                    <p className="font-medium text-foreground">No upcoming visits right now</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Check back later for new opportunities.</p>
                  </div>
                )}
              </div>
            </section>

            {/* MY APPLICATIONS */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" /> My Applications
                </h2>
                <Link href="/dashboard/applications" className="text-sm font-medium text-accent hover:underline">Manage All</Link>
              </div>
              
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <div key={app.id} className="bg-[var(--card)]/40 border border-[var(--border)] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between transition-colors hover:bg-[var(--card)]">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-black border border-[var(--border)] flex items-center justify-center shrink-0">
                          {app.company_visits.companies.logoUrl ? (
                            <img src={app.company_visits.companies.logoUrl} alt="" className="w-8 h-8 object-contain" />
                          ) : (
                            <Briefcase className="h-5 w-5 text-zinc-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground leading-tight">
                            <Link href={`/visits/${app.company_visits.slug || app.company_visits.id}`} className="hover:text-primary transition-colors">
                              {app.company_visits.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">{app.company_visits.companies.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                        <Badge variant="outline" className={
                          app.status === "APPROVED" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                          app.status === "REJECTED" ? "border-red-500/30 text-red-400 bg-red-500/10" :
                          app.status === "CANCELLED" ? "border-zinc-500/30 text-zinc-400 bg-zinc-500/10" :
                          "border-amber-500/30 text-amber-400 bg-amber-500/10"
                        }>
                          {app.status === "APPROVED" ? "Action Required: Pay" : app.status}
                        </Badge>
                        <span className="text-xs font-medium text-[var(--text-muted)]">
                          {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-[var(--card)]/40 border border-dashed border-[var(--border)] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-[var(--border)] flex items-center justify-center mb-3">
                      <FileText className="h-5 w-5 text-[var(--text-muted)]" />
                    </div>
                    <p className="font-medium text-foreground">You haven't applied to any visits yet</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Start browsing opportunities to build your career.</p>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="space-y-8">
            
            {/* QUICK ACTIONS */}
            <section>
              <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/visits" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[var(--card)]/40 hover:bg-[var(--card)] border border-[var(--border)] hover:border-primary/50 transition-all text-center gap-2 group">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Browse Visits</span>
                </Link>
                <Link href="/profile" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[var(--card)]/40 hover:bg-[var(--card)] border border-[var(--border)] hover:border-accent/50 transition-all text-center gap-2 group">
                  <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">My Profile</span>
                </Link>
                <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[var(--card)]/20 border border-[var(--border)] opacity-50 cursor-not-allowed text-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Download className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Certificates</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[var(--card)]/20 border border-[var(--border)] opacity-50 cursor-not-allowed text-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Star className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Badges</span>
                </button>
              </div>
            </section>

            {/* RECENT ACTIVITY */}
            <section>
              <h2 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Activity
              </h2>
              <div className="bg-[var(--card)]/40 border border-[var(--border)] rounded-2xl p-5">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border)] before:to-transparent">
                  
                  {applications.length > 0 ? (
                    applications.slice(0, 3).map((app, i) => (
                      <div key={app.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[var(--border)] bg-black text-[var(--text-muted)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          {app.status === "APPROVED" ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <FileText className="h-3 w-3" />
                          )}
                        </div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] ml-3 md:ml-0 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-foreground">
                              {app.status === "APPROVED" ? "Application Approved" : "Applied"}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {app.company_visits.companies.name}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-[var(--text-muted)] relative z-10">
                      No recent activity.
                    </div>
                  )}

                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
