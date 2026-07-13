import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Building2,
  MapPin,
  FileText,
  GraduationCap,
  IndianRupee,
  Clock,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userName = session?.user?.name?.split(" ")[0] || "Admin";

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalCompanies,
    totalVisits,
    upcomingVisits,
    totalApplications,
    pendingApplications,
    approvedApplications,
    totalStudents,
    todaysRegistrations,
    recentApplications,
    recentCompanies,
    revenueData,
  ] = await Promise.all([
    prisma.companies.count({ where: { deletedAt: null } }),
    prisma.company_visits.count({ where: { deletedAt: null } }),
    prisma.company_visits.count({
      where: { deletedAt: null, published: true, scheduledDate: { gte: now } },
    }),
    prisma.visit_requests.count(),
    prisma.visit_requests.count({ where: { status: "PENDING" } }),
    prisma.visit_requests.count({ where: { status: "APPROVED" } }),
    prisma.studentProfile.count(),
    prisma.studentProfile.count({
      where: { createdAt: { gte: todayStart } },
    }),
    prisma.visit_requests.findMany({
      take: 8,
      orderBy: { appliedAt: "desc" },
      include: {
        students: { include: { user: true } },
        company_visits: { include: { companies: true } },
      },
    }),
    prisma.companies.findMany({
      take: 3,
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.visit_requests.findMany({
      where: { status: "APPROVED" },
      include: { company_visits: { select: { fee: true } } },
    }),
  ]);

  const totalRevenue = revenueData.reduce(
    (sum, app) => sum + (app.company_visits.fee || 0),
    0
  );

  // Build recent activity events
  const timelineEvents = [
    ...recentApplications.map((app) => ({
      id: app.id,
      title: `${app.students.user.name} applied`,
      description: `${app.company_visits.companies.name} — ${app.company_visits.title}`,
      time: formatDistanceToNow(new Date(app.appliedAt), { addSuffix: false }),
      type: (app.status === "APPROVED"
        ? "approval"
        : app.status === "REJECTED"
        ? "rejection"
        : "application") as "application" | "approval" | "rejection",
    })),
    ...recentCompanies.map((company) => ({
      id: company.id,
      title: `${company.name} added`,
      description: company.industry || "New company",
      time: formatDistanceToNow(new Date(company.createdAt), { addSuffix: false }),
      type: "company" as const,
    })),
  ]
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 10);

  // Time-of-day greeting
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const stats = [
    {
      label: "Total Companies",
      value: totalCompanies,
      icon: "Building2",
      glowClass: "stat-glow-blue",
      accentColor: "text-blue-400 bg-blue-500/10",
    },
    {
      label: "Upcoming Visits",
      value: upcomingVisits,
      icon: "MapPin",
      glowClass: "stat-glow-purple",
      accentColor: "text-purple-400 bg-purple-500/10",
    },
    {
      label: "Total Applications",
      value: totalApplications,
      icon: "FileText",
      glowClass: "stat-glow-amber",
      accentColor: "text-amber-400 bg-amber-500/10",
    },
    {
      label: "Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: "IndianRupee",
      glowClass: "stat-glow-emerald",
      accentColor: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Registered Students",
      value: totalStudents,
      icon: "GraduationCap",
      glowClass: "stat-glow-blue",
      accentColor: "text-sky-400 bg-sky-500/10",
    },
    {
      label: "Today's Registrations",
      value: todaysRegistrations,
      icon: "TrendingUp",
      glowClass: "stat-glow-emerald",
      accentColor: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Pending Applications",
      value: pendingApplications,
      icon: "Clock",
      glowClass: "stat-glow-amber",
      accentColor: "text-orange-400 bg-orange-500/10",
    },
    {
      label: "Approved Applications",
      value: approvedApplications,
      icon: "CheckCircle2",
      glowClass: "stat-glow-emerald",
      accentColor: "text-emerald-400 bg-emerald-500/10",
    },
  ];

  const quickActions = [
    { label: "Add Company", href: "/admin/companies/new", icon: "Building2", color: "from-blue-500/10 to-blue-600/5 hover:from-blue-500/15 hover:to-blue-600/10", iconColor: "text-blue-400" },
    { label: "Create Visit", href: "/admin/visits/new", icon: "MapPin", color: "from-purple-500/10 to-purple-600/5 hover:from-purple-500/15 hover:to-purple-600/10", iconColor: "text-purple-400" },
    { label: "Review Applications", href: "/admin/applications", icon: "FileText", color: "from-amber-500/10 to-amber-600/5 hover:from-amber-500/15 hover:to-amber-600/10", iconColor: "text-amber-400" },
    { label: "Manage Students", href: "/admin/students", icon: "GraduationCap", color: "from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/15 hover:to-emerald-600/10", iconColor: "text-emerald-400" },
    { label: "Analytics", href: "/admin", icon: "BarChart3", color: "from-sky-500/10 to-sky-600/5 hover:from-sky-500/15 hover:to-sky-600/10", iconColor: "text-sky-400" },
    { label: "Settings", href: "/admin/settings", icon: "Settings", color: "from-zinc-500/10 to-zinc-600/5 hover:from-zinc-500/15 hover:to-zinc-600/10", iconColor: "text-zinc-400" },
  ];

  return (
    <DashboardClient
      greeting={greeting}
      userName={userName}
      stats={stats}
      quickActions={quickActions}
      timelineEvents={timelineEvents}
      pendingApplications={pendingApplications}
    />
  );
}
