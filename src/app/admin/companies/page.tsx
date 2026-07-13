import { getCompanies } from "@/app/actions/company";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;

  const result = await getCompanies({ search, page, limit: 10 });
  const companies = result.companies || [];
  const totalPages = result.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="Manage participating companies"
      >
        <Link href="/admin/companies/new">
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/10">
            <Plus className="h-4 w-4" />
            Add Company
          </button>
        </Link>
      </PageHeader>

      <DataTable
        searchValue={search}
        searchPlaceholder="Search companies…"
        footer={
          <Pagination
            page={page}
            totalPages={totalPages}
            baseUrl="/admin/companies"
            searchParams={search ? { search } : {}}
          />
        }
      >
        {companies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies yet"
            description="Create your first company to start managing industrial visits."
            actionLabel="Add Company"
            actionHref="/admin/companies/new"
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] text-left">
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Industry</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider text-center">Visits</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.04] group-hover:border-white/[0.08] transition-colors">
                        {company.logoUrl ? (
                          <img src={company.logoUrl} alt="" className="h-5 w-5 object-contain" />
                        ) : (
                          <Building2 className="h-4 w-4 text-zinc-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/companies/${company.id}`}
                          className="font-medium text-zinc-200 hover:text-blue-400 transition-colors truncate block"
                        >
                          {company.name}
                        </Link>
                        {company.website && (
                          <span className="text-[11px] text-zinc-600 truncate block">
                            {company.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {company.industry ? (
                      <Badge className="bg-white/[0.03] text-zinc-400 border-white/[0.04] text-[10px] font-medium">
                        {company.industry}
                      </Badge>
                    ) : (
                      <span className="text-zinc-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-zinc-500">
                      {company.headquarters || company.location || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                      {company._count.company_visits}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/companies/${company.id}`}
                        className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/companies/${company.id}/edit`}
                        className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
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
