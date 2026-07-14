import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, Clock, MapPin, IndianRupee, FileText, ChevronRight, Ban, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function MyApplicationsPage() {
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

  const applications = await prisma.visit_requests.findMany({
    where: { studentId: studentProfile.id },
    include: {
      company_visits: {
        include: { companies: true },
      },
      payments: true,
    },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      <nav className="border-b border-[var(--border)] bg-black/40 sticky top-0 z-50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-sm font-medium text-[var(--text-secondary)] hover:text-foreground transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">My Applications</h1>
          <p className="text-[var(--text-secondary)]">Track the status of your company visits and placements.</p>
        </div>

        <div className="space-y-6">
          {applications.length > 0 ? (
            applications.map((app) => {
              const visit = app.company_visits;
              const company = visit.companies;
              const payment = app.payments;
              
              // Timeline logic
              const steps = [
                { label: "Applied", active: true, done: true },
                { label: "Eligibility", active: app.status !== "CANCELLED", done: app.status !== "PENDING" && app.status !== "CANCELLED" },
                { label: "Approved", active: app.status === "APPROVED" || visit.status === "COMPLETED", done: app.status === "APPROVED" || visit.status === "COMPLETED" },
                { label: "Payment", active: payment != null, done: payment?.status === "PAID" },
                { label: "Confirmed", active: payment?.status === "PAID", done: payment?.status === "PAID" },
              ];

              return (
                <div key={app.id} className="bg-[var(--card)]/40 border border-[var(--border)] rounded-3xl overflow-hidden hover:border-primary/30 transition-colors">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start">
                    
                    <div className="flex gap-5 flex-1 w-full">
                      <div className="h-16 w-16 rounded-2xl bg-black border border-[var(--border)] flex items-center justify-center p-3 shrink-0">
                        {company.logoUrl ? (
                          <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                        ) : (
                          <Building2 className="h-8 w-8 text-zinc-500" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <Badge variant="outline" className={
                            app.status === "APPROVED" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                            app.status === "REJECTED" ? "border-red-500/30 text-red-400 bg-red-500/10" :
                            app.status === "CANCELLED" ? "border-zinc-500/30 text-zinc-400 bg-zinc-500/10" :
                            "border-amber-500/30 text-amber-400 bg-amber-500/10"
                          }>
                            {app.status}
                          </Badge>
                          {payment?.status === "PAID" && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                              Payment Complete
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-1">{visit.title}</h3>
                        <p className="text-sm text-[var(--text-secondary)] font-medium mb-4">{company.name}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" /> Applied on {format(new Date(app.appliedAt), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" /> {visit.city || "TBA"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <IndianRupee className="h-4 w-4" /> {visit.fee > 0 ? visit.fee : "Free"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 border-t border-[var(--border)] md:border-0 pt-6 md:pt-0">
                      {app.status === "APPROVED" && payment?.status !== "PAID" ? (
                        <Link href={`/visits/${visit.slug || visit.id}/payment`} className="w-full">
                          <button className="w-full px-6 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            Proceed to Payment
                          </button>
                        </Link>
                      ) : (
                        <Link href={`/visits/${visit.slug || visit.id}`} className="w-full">
                          <button className="w-full px-6 h-11 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-medium rounded-xl transition-colors">
                            View Details
                          </button>
                        </Link>
                      )}
                      
                      {app.status === "PENDING" && (
                        <button className="w-full px-6 h-11 bg-transparent hover:bg-white/5 text-[var(--text-secondary)] hover:text-red-400 font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                          <Ban className="h-4 w-4" /> Cancel Application
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  <div className="bg-black/20 border-t border-[var(--border)] p-6 md:px-8">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[var(--border)] z-0" />
                      
                      {steps.map((step, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center gap-2 bg-transparent">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                            step.done ? "bg-emerald-500 border-emerald-500 text-black" : 
                            step.active ? "bg-[var(--card)] border-primary text-primary" : 
                            "bg-[var(--card)] border-[var(--border)] text-[var(--text-muted)]"
                          }`}>
                            {step.done ? <CheckCircle2 className="h-4 w-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                          </div>
                          <span className={`text-xs font-medium hidden sm:block ${
                            step.done ? "text-emerald-500" :
                            step.active ? "text-primary" :
                            "text-[var(--text-muted)]"
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-[var(--card)]/40 border border-dashed border-[var(--border)] rounded-3xl p-12 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-[var(--border)] flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No applications found</h3>
              <p className="text-[var(--text-secondary)] mt-2 mb-6 max-w-md">
                You haven't applied to any industrial visits yet. Browse our open opportunities to get started.
              </p>
              <Link href="/visits">
                <button className="px-6 h-11 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  Browse Opportunities
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
