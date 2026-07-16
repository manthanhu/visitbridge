import { getVisits } from "@/app/actions/visit";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Users, Calendar, IndianRupee } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminVisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;

  const result = await getVisits({ search, page, limit: 12 });
  const visits = result.visits || [];
  const totalPages = result.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Industrial Visits"
        description="Manage upcoming visits and placement drives"
      >
        <Link href="/admin/visits/new">
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/10">
            <Plus className="h-4 w-4" />
            Create Visit
          </button>
        </Link>
      </PageHeader>

      {visits.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No visits yet"
          description="Create your first industrial visit to start accepting applications."
          actionLabel="Create Visit"
          actionHref="/admin/visits/new"
        />
      ) : (
        <>
          {/* Visit Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visits.map((visit: typeof visits[0]) => {
              const isFull = visit.availableSeats <= 0;
              const filledPercent = Math.round(
                ((visit.totalSeats - visit.availableSeats) / visit.totalSeats) * 100
              );

              return (
                <Link
                  key={visit.id}
                  href={`/admin/visits/${visit.id}`}
                  className="group relative flex flex-col rounded-xl border border-white/[0.04] bg-[#12121a] p-5 transition-all hover:border-white/[0.08] hover:shadow-lg hover:shadow-blue-500/[0.03]"
                >
                  {/* Top row: company + status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold">
                        {visit.companies?.name?.charAt(0) || "?"}
                      </div>
                      <span className="text-xs font-medium text-zinc-500 truncate">
                        {visit.companies?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {visit.published ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Live</Badge>
                      ) : (
                        <Badge className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20 text-[10px]">Draft</Badge>
                      )}
                      {isFull && (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">Full</Badge>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-zinc-200 mb-1 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {visit.title}
                  </h3>

                  {/* Type badge */}
                  <div className="mb-3">
                    <Badge className="bg-white/[0.03] text-zinc-500 border-white/[0.04] text-[10px]">
                      {visit.visitType}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-zinc-500 flex-1">
                    {visit.scheduledDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 shrink-0 text-zinc-600" />
                        <span>{format(new Date(visit.scheduledDate), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    {visit.city && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 shrink-0 text-zinc-600" />
                        <span>{visit.city}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-white/[0.04]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Users className="h-3 w-3" />
                        <span className="tabular-nums">{visit.totalSeats - visit.availableSeats}/{visit.totalSeats}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-xs font-medium text-zinc-300">
                        <IndianRupee className="h-3 w-3" />
                        <span>{visit.fee > 0 ? visit.fee.toLocaleString() : "Free"}</span>
                      </div>
                    </div>

                    {/* Seats progress bar */}
                    <div className="h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          filledPercent > 80 ? "bg-red-500/60" : filledPercent > 50 ? "bg-amber-500/60" : "bg-blue-500/40"
                        }`}
                        style={{ width: `${filledPercent}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Pagination
                page={page}
                totalPages={totalPages}
                baseUrl="/admin/visits"
                searchParams={search ? { search } : {}}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
