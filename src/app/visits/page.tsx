import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Search, MapPin, Calendar, Users, IndianRupee, Building2, Filter, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { checkEligibility } from "@/lib/eligibility";

type CompanyVisitWhereInput = NonNullable<NonNullable<Parameters<typeof prisma.company_visits.findMany>[0]>["where"]>;

export default async function VisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const cityFilter = typeof params.city === "string" ? params.city : "";
  const typeFilter = typeof params.type === "string" ? params.type : "";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;
  const limit = 12;

  // Get student profile for eligibility checks
  let studentProfile = null;
  if (session?.user) {
    studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });
  }

  // Build where clause
  const where: CompanyVisitWhereInput = {
    published: true,
    deletedAt: null,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { companies: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (cityFilter) {
    where.city = { contains: cityFilter, mode: "insensitive" };
  }

  if (typeFilter) {
    where.visitType = typeFilter as NonNullable<CompanyVisitWhereInput["visitType"]>;
  }

  const [visits, total] = await Promise.all([
    prisma.company_visits.findMany({
      where,
      include: {
        companies: true,
        eligibilityRule: true,
        _count: { select: { visit_requests: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.company_visits.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Get distinct cities for filter
  const cities = await prisma.company_visits.findMany({
    where: { published: true, deletedAt: null, city: { not: null } },
    select: { city: true },
    distinct: ["city"],
  });

  const visitTypes = ["INTERNSHIP", "PLACEMENT", "EVENT", "WORKSHOP", "OTHER"];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href={session?.user ? "/dashboard" : "/"} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-50 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold text-zinc-50">Browse Visits</h1>
          </div>
          <Link href={session?.user ? "/dashboard" : "/sign-in"}>
            <Button variant="outline" size="sm">{session?.user ? "Dashboard" : "Sign In"}</Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
            Industrial Visits & Opportunities
          </h2>
          <p className="mt-2 text-zinc-400">
            Browse upcoming company visits, workshops, and placement drives
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <form className="flex-1 min-w-[240px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search visits or companies..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </form>
          <div className="flex gap-2">
            {cityFilter && (
              <Link href="/visits">
                <Badge variant="outline" className="cursor-pointer border-blue-500 text-blue-400 hover:bg-blue-500/10 px-3 py-1.5">
                  {cityFilter} ✕
                </Badge>
              </Link>
            )}
            {typeFilter && (
              <Link href={cityFilter ? `/visits?city=${cityFilter}` : "/visits"}>
                <Badge variant="outline" className="cursor-pointer border-purple-500 text-purple-400 hover:bg-purple-500/10 px-3 py-1.5">
                  {typeFilter} ✕
                </Badge>
              </Link>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mr-2 self-center">Type:</span>
          {visitTypes.map((type: typeof visitTypes[0]) => (
            <Link
              key={type}
              href={`/visits?type=${type}${cityFilter ? `&city=${cityFilter}` : ""}${search ? `&search=${search}` : ""}`}
            >
              <Badge
                variant={typeFilter === type ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1 text-xs ${
                  typeFilter === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                }`}
              >
                {type}
              </Badge>
            </Link>
          ))}
        </div>

        {cities.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mr-2 self-center">City:</span>
            {cities.map((c: typeof cities[0]) => (
              <Link
                key={c.city}
                href={`/visits?city=${c.city}${typeFilter ? `&type=${typeFilter}` : ""}${search ? `&search=${search}` : ""}`}
              >
                <Badge
                  variant={cityFilter === c.city ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 text-xs ${
                    cityFilter === c.city
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {c.city}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="mb-6 text-sm text-zinc-500">
          Showing {visits.length} of {total} visit{total !== 1 ? "s" : ""}
        </p>

        {/* Visits Grid */}
        {visits.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-16">
            <Building2 className="h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-medium text-zinc-300">No visits found</h3>
            <p className="text-zinc-500 mt-1">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visits.map((visit: typeof visits[0]) => {
              const eligibility = studentProfile
                ? checkEligibility(
                    {
                      currentCgpa: studentProfile.currentCgpa,
                      backlogs: studentProfile.backlogs,
                      semester: studentProfile.semester,
                      graduationYear: studentProfile.graduationYear,
                      branch: studentProfile.branch,
                      college: studentProfile.college,
                      gender: studentProfile.gender,
                    },
                    visit.eligibilityRule
                  )
                : null;

              const isFull = visit.availableSeats <= 0;
              const isDeadlinePassed = visit.registrationDeadline
                ? new Date(visit.registrationDeadline) < new Date()
                : false;

              return (
                <Link
                  key={visit.id}
                  href={`/visits/${visit.slug || visit.id}`}
                  className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-blue-500/5"
                >
                  {/* Company info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold text-sm">
                      {visit.companies.name?.charAt(0) || "C"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-300 truncate">{visit.companies.name}</p>
                      <p className="text-xs text-zinc-500">{visit.companies.industry || "Technology"}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${
                        visit.visitType === "PLACEMENT"
                          ? "border-emerald-500/50 text-emerald-400"
                          : visit.visitType === "INTERNSHIP"
                          ? "border-blue-500/50 text-blue-400"
                          : visit.visitType === "WORKSHOP"
                          ? "border-purple-500/50 text-purple-400"
                          : "border-zinc-600 text-zinc-400"
                      }`}
                    >
                      {visit.visitType}
                    </Badge>
                  </div>

                  {/* Visit title */}
                  <h3 className="text-lg font-semibold text-zinc-100 mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {visit.title}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 mb-4 flex-1">
                    {visit.scheduledDate && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>{format(new Date(visit.scheduledDate), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    {visit.city && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{visit.city}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {visit.availableSeats} / {visit.totalSeats} seats
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-1 text-zinc-100 font-semibold">
                      <IndianRupee className="h-4 w-4" />
                      <span>{visit.fee > 0 ? visit.fee.toLocaleString() : "Free"}</span>
                    </div>
                    <div>
                      {isFull ? (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/30">Full</Badge>
                      ) : isDeadlinePassed ? (
                        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Closed</Badge>
                      ) : !session?.user ? (
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20">Sign in to apply</Badge>
                      ) : eligibility ? (
                        eligibility.eligible ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Eligible</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/30">Not Eligible</Badge>
                        )
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/visits?page=${page - 1}${search ? `&search=${search}` : ""}${cityFilter ? `&city=${cityFilter}` : ""}${typeFilter ? `&type=${typeFilter}` : ""}`}
              >
                <Button variant="outline" size="sm">Previous</Button>
              </Link>
            )}
            <span className="text-sm text-zinc-400">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/visits?page=${page + 1}${search ? `&search=${search}` : ""}${cityFilter ? `&city=${cityFilter}` : ""}${typeFilter ? `&type=${typeFilter}` : ""}`}
              >
                <Button variant="outline" size="sm">Next</Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
