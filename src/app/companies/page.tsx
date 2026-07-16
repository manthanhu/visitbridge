import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Building2, MapPin, ArrowUpRight, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type CompanyWhereInput = NonNullable<NonNullable<Parameters<typeof prisma.companies.findMany>[0]>["where"]>;

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const industryFilter = typeof params.industry === "string" ? params.industry : "";

  // Build where clause
  const where: CompanyWhereInput = {
    isActive: true,
    deletedAt: null,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (industryFilter) {
    where.industry = { contains: industryFilter, mode: "insensitive" };
  }

  const companies = await prisma.companies.findMany({
    where,
    include: {
      _count: {
        select: { company_visits: { where: { published: true, deletedAt: null } } }
      }
    },
    orderBy: { name: "asc" },
  });

  // Get distinct industries for filter
  const industries = await prisma.companies.findMany({
    where: { isActive: true, deletedAt: null, industry: { not: null } },
    select: { industry: true },
    distinct: ["industry"],
  });

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-[var(--border)] bg-[var(--background)]/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              VisitBridge
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-white/[0.03] border-[var(--border)] hover:bg-white/[0.08]">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button variant="outline" size="sm" className="bg-white/[0.03] border-[var(--border)] hover:bg-white/[0.08]">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Explore Partner <span className="text-gradient-blue">Companies</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Discover top-tier companies offering industrial visits, workshops, and placement opportunities.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap gap-4">
          <form className="flex-1 min-w-[280px] max-w-md">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search companies..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-[var(--text-muted)] focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </form>
          
          <div className="flex flex-wrap gap-2 items-center">
            {industryFilter && (
              <Link href="/companies">
                <Badge className="cursor-pointer bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1.5 text-sm">
                  {industryFilter} <span className="ml-2 text-xs">✕</span>
                </Badge>
              </Link>
            )}
          </div>
        </div>

        {/* Filter chips */}
        {industries.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mr-2">Industries:</span>
            {industries.map((ind) => (
              <Link
                key={ind.industry}
                href={`/companies?industry=${ind.industry}${search ? `&search=${search}` : ""}`}
              >
                <Badge
                  variant={industryFilter === ind.industry ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
                    industryFilter === ind.industry
                      ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:bg-white/[0.03]"
                  }`}
                >
                  {ind.industry}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="mb-8 text-sm font-medium text-[var(--text-muted)]">
          Showing {companies.length} compan{companies.length === 1 ? "y" : "ies"}
        </p>

        {/* Companies Grid */}
        {companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm py-24 px-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6 border border-white/[0.08]">
              <Building2 className="h-8 w-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No companies found</h3>
            <p className="text-[var(--text-secondary)]">Try adjusting your filters or search terms</p>
            {(search || industryFilter) && (
              <Link href="/companies" className="mt-6">
                <Button variant="outline" className="border-[var(--border)] hover:bg-white/[0.03]">Clear all filters</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/company/${company.slug || company.id}`}
                className="group relative flex flex-col h-full rounded-3xl bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] p-6 lg:p-8 hover:-translate-y-2 hover:border-[var(--border-hover)] transition-all duration-500 shadow-lg group-hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] overflow-hidden"
              >
                {/* Layered Shadow & Hover Glow */}
                <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/0 via-transparent to-accent/0 group-hover:from-primary/20 group-hover:to-accent/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[2px] -z-10" />
                
                {/* Top row */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                      <div className="relative h-14 w-14 rounded-2xl bg-white/[0.04] flex items-center justify-center text-foreground text-xl font-bold border border-white/[0.08] shadow-inner overflow-hidden">
                        {company.logoUrl ? (
                          <img src={company.logoUrl} alt={company.name} className="w-10 h-10 object-contain relative z-10" />
                        ) : (
                          <span className="relative z-10">{company.name.charAt(0)}</span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {company.name}
                      </h3>
                      {company.industry && (
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.05] text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
                          {company.industry}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/[0.03] flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300 border border-[var(--border)] group-hover:border-primary/20">
                    <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-primary transition-all -translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100" />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                    {company.description || "No description provided."}
                  </p>
                </div>

                {/* Footer info */}
                <div className="mt-8 pt-5 border-t border-[var(--border)] group-hover:border-white/10 transition-colors duration-300 grid grid-cols-2 gap-4">
                  {company.location && (
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium">
                      <MapPin className="h-4 w-4 text-primary/70 shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </div>
                  )}
                  {company._count && (
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium justify-end">
                      <Briefcase className="h-4 w-4 text-accent/70 shrink-0" />
                      <span>{company._count.company_visits} visits</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
