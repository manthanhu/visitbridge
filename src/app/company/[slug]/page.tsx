import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPin, Globe, Users, Calendar, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await prisma.companies.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      isActive: true,
      deletedAt: null,
    },
    include: {
      company_visits: {
        where: { published: true, deletedAt: null },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) {
    notFound();
  }

  const upcomingVisits = company.company_visits.filter(
    (visit) => visit.status !== "COMPLETED" && visit.status !== "CANCELLED"
  );
  const pastVisits = company.company_visits.filter(
    (visit) => visit.status === "COMPLETED"
  );

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-[var(--border)] bg-[var(--background)]/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/companies">
            <Button variant="ghost" size="sm" className="text-[var(--text-muted)] hover:text-foreground hover:bg-white/[0.05] -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Banner area */}
        <div className="relative rounded-3xl overflow-hidden bg-[var(--card)] border border-[var(--border)] mb-12 p-8 md:p-12 shadow-lg">
          {/* Subtle noise pattern and glow */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/[0.03] flex items-center justify-center shrink-0 border border-[var(--border)] shadow-xl p-4">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="h-12 w-12 text-[var(--text-muted)]" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {company.industry && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                    {company.industry}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                {company.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-[var(--text-secondary)] text-sm font-medium">
                {company.location && (
                  <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <MapPin className="h-4 w-4 text-primary" /> {company.location}
                  </div>
                )}
                {company.employeeCount && (
                  <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Users className="h-4 w-4 text-accent" /> {company.employeeCount} employees
                  </div>
                )}
                {company.foundedYear && (
                  <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                    <Calendar className="h-4 w-4 text-emerald-500" /> Founded {company.foundedYear}
                  </div>
                )}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-white/[0.08] transition-colors hover:text-foreground">
                    <Globe className="h-4 w-4" /> Website <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">About {company.name}</h2>
              <div className="prose prose-invert max-w-none">
                {company.description ? (
                  <p className="text-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                    {company.description}
                  </p>
                ) : (
                  <p className="italic text-[var(--text-muted)]">No description provided yet.</p>
                )}
              </div>
            </section>

            {/* Upcoming Visits */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Open Opportunities</h2>
                <Badge variant="outline" className="text-[var(--text-muted)]">{upcomingVisits.length} available</Badge>
              </div>
              
              {upcomingVisits.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {upcomingVisits.map((visit) => (
                    <Link
                      key={visit.id}
                      href={`/visits/${visit.slug || visit.id}`}
                      className="group relative flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-[0_10px_30px_-15px_rgba(59,130,246,0.2)] overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 group-hover:from-primary/10 group-hover:to-transparent transition-colors duration-500" />
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20">{visit.visitType}</Badge>
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{visit.title}</h3>
                        
                        <div className="space-y-2 mb-6 mt-auto">
                          {visit.scheduledDate && (
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                              <Calendar className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                              <span>{format(new Date(visit.scheduledDate), "MMM d, yyyy")}</span>
                            </div>
                          )}
                          {visit.city && (
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                              <MapPin className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                              <span>{visit.city}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between mt-auto">
                          <span className="text-sm font-medium text-foreground">
                            {visit.fee > 0 ? `₹${visit.fee.toLocaleString()}` : "Free"}
                          </span>
                          <span className="text-primary text-sm font-medium flex items-center group-hover:underline">
                            View details <ArrowRight className="ml-1 h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--border)] border-dashed p-8 text-center bg-[var(--card)]/30">
                  <p className="text-[var(--text-secondary)]">No upcoming visits or opportunities at the moment.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Facts */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">Quick Facts</h3>
              <ul className="space-y-4">
                {company.headquarters && (
                  <li className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                    <span className="text-[var(--text-secondary)] text-sm">Headquarters</span>
                    <span className="text-foreground font-medium text-sm text-right max-w-[50%]">{company.headquarters}</span>
                  </li>
                )}
                {company.industry && (
                  <li className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                    <span className="text-[var(--text-secondary)] text-sm">Industry</span>
                    <span className="text-foreground font-medium text-sm text-right max-w-[50%]">{company.industry}</span>
                  </li>
                )}
                {company.foundedYear && (
                  <li className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                    <span className="text-[var(--text-secondary)] text-sm">Founded</span>
                    <span className="text-foreground font-medium text-sm">{company.foundedYear}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Past Visits */}
            {pastVisits.length > 0 && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">Past Programs</h3>
                <div className="space-y-4">
                  {pastVisits.map((visit) => (
                    <Link key={visit.id} href={`/visits/${visit.slug || visit.id}`} className="group block">
                      <div className="p-3 rounded-lg hover:bg-white/[0.03] transition-colors border border-transparent hover:border-[var(--border)]">
                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{visit.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                          <span>{visit.visitType}</span>
                          <span>•</span>
                          <span>{visit.scheduledDate ? format(new Date(visit.scheduledDate), "MMM yyyy") : "Past"}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
