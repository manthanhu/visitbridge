import { getCompanyById } from "@/app/actions/company";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Globe, MapPin, Users, Calendar, Edit, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCompanyById(id);

  if (result.error || !result.company) {
    notFound();
  }

  const company = result.company;

  // Fetch recent visits for this company
  const visits = await prisma.company_visits.findMany({
    where: { companyId: company.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { _count: { select: { visit_requests: true } } },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/companies"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.04]">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="h-7 w-7 object-contain" />
              ) : (
                <Building2 className="h-5 w-5 text-zinc-600" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-50">{company.name}</h1>
              {company.industry && (
                <p className="text-xs text-zinc-500 mt-0.5">{company.industry}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/companies/${company.id}/edit`}>
            <button className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2 text-sm font-medium text-zinc-300 hover:bg-white/[0.05] transition-colors">
              <Edit className="h-3.5 w-3.5" />
              Edit
            </button>
          </Link>
          <Link href={`/admin/visits/new?companyId=${company.id}`}>
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/10">
              <Plus className="h-3.5 w-3.5" />
              Create Visit
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* About */}
          <div className="rounded-xl border border-white/[0.04] bg-[#12121a] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.04]">
              <h3 className="text-sm font-semibold text-zinc-200">About</h3>
            </div>
            <div className="px-5 py-4">
              {company.description ? (
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{company.description}</p>
              ) : (
                <p className="text-sm text-zinc-600 italic">No description provided.</p>
              )}
            </div>
          </div>

          {/* Visits */}
          <div className="rounded-xl border border-white/[0.04] bg-[#12121a] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
              <h3 className="text-sm font-semibold text-zinc-200">Visits</h3>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                {company._count.company_visits} Total
              </Badge>
            </div>
            {visits.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <MapPin className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">No visits created yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.03]">
                {visits.map((visit: typeof visits[0]) => (
                  <Link
                    key={visit.id}
                    href={`/admin/visits/${visit.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-zinc-300 group-hover:text-blue-400 transition-colors truncate">
                        {visit.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-600">
                        {visit.scheduledDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(visit.scheduledDate), "MMM d, yyyy")}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {visit.availableSeats}/{visit.totalSeats}
                        </span>
                        <span>{visit._count.visit_requests} apps</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className="bg-white/[0.03] text-zinc-500 border-white/[0.04] text-[10px]">
                        {visit.visitType}
                      </Badge>
                      {visit.published ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Live</Badge>
                      ) : (
                        <Badge className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20 text-[10px]">Draft</Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.04] bg-[#12121a] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.04]">
              <h3 className="text-sm font-semibold text-zinc-200">Details</h3>
            </div>
            <div className="px-5 py-4 space-y-4">
              <DetailItem
                icon={MapPin}
                label="Headquarters"
                value={company.headquarters || company.location || "Not specified"}
              />
              {company.website && (
                <DetailItem icon={Globe} label="Website">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                  >
                    {company.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </DetailItem>
              )}
              {company.foundedYear && (
                <DetailItem icon={Calendar} label="Founded" value={String(company.foundedYear)} />
              )}
              {company.employeeCount && (
                <DetailItem icon={Users} label="Size" value={`${company.employeeCount} employees`} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-3.5 w-3.5 mt-0.5 text-zinc-600 shrink-0" />
      <div>
        <p className="text-[11px] font-medium text-zinc-500 mb-0.5">{label}</p>
        {children || <p className="text-xs text-zinc-300">{value}</p>}
      </div>
    </div>
  );
}
