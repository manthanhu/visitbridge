import { getApplications } from "@/app/actions/admin-application";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { ApplicationActions } from "./application-actions";

const statusFilters = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED", "WAITLISTED"];

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  CANCELLED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  WAITLISTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const status = typeof params.status === "string" ? params.status : "ALL";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;

  const result = await getApplications({ search, status, page, limit: 15 });
  const applications = result.applications || [];
  const totalPages = result.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Review and manage student applications"
      />

      {/* Status filters */}
      <div className="flex flex-wrap gap-1.5">
        {statusFilters.map((s) => (
          <Link
            key={s}
            href={`/admin/applications${s !== "ALL" ? `?status=${s}` : ""}${search ? `&search=${search}` : ""}`}
          >
            <button
              className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                status === s
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "text-zinc-500 hover:text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08]"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          </Link>
        ))}
      </div>

      <DataTable
        searchValue={search}
        searchPlaceholder="Search by student, company, or visit…"
        footer={
          <Pagination
            page={page}
            totalPages={totalPages}
            baseUrl="/admin/applications"
            searchParams={{ ...(search && { search }), ...(status !== "ALL" && { status }) }}
          />
        }
      >
        {applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications found"
            description="Applications will appear here when students apply to visits."
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] text-left">
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Company / Visit</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Branch</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden lg:table-cell">CGPA</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Applied</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {applications.map((app: any) => (
                <tr
                  key={app.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-xs font-bold text-blue-300 ring-1 ring-white/[0.06]">
                        {app.students.user.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-200 truncate">{app.students.user.name}</p>
                        <p className="text-[11px] text-zinc-600 truncate">{app.students.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-zinc-300 truncate text-xs">{app.company_visits.companies.name}</p>
                    <p className="text-[11px] text-zinc-600 truncate">{app.company_visits.title}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-zinc-400">{app.students.branch || "N/A"}</span>
                    <span className="text-[11px] text-zinc-600 block">Sem {app.students.semester || "?"}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs font-medium text-zinc-300 tabular-nums">
                      {app.students.currentCgpa?.toFixed(1) || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-zinc-500 tabular-nums">
                      {format(new Date(app.appliedAt), "MMM d, yyyy")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] ${statusStyles[app.status] || statusStyles.PENDING}`}>
                      {app.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ApplicationActions id={app.id} status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataTable>
    </div>
  );
}
