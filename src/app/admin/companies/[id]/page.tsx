import { getCompanyById } from "@/app/actions/company";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Globe, MapPin, Users, Calendar, Edit, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/companies">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-8 h-8 object-contain" />
              ) : (
                <Building2 className="h-6 w-6 text-zinc-500" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-50">{company.name}</h1>
              {company.industry && <p className="text-zinc-400 text-sm">{company.industry}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/companies/${company.id}/edit`}>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
          <Link href={`/admin/visits/new?companyId=${company.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Visit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">About {company.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none text-zinc-300">
                {company.description ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{company.description}</p>
                ) : (
                  <p className="text-zinc-500 italic">No description provided.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-zinc-100">Recent Visits</CardTitle>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {company._count.company_visits} Total
              </Badge>
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <p className="text-zinc-500 text-sm">No visits created for this company yet.</p>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {visits.map((visit) => (
                    <div key={visit.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div>
                        <h4 className="font-medium text-zinc-200">{visit.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-500">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {visit.city || "TBD"}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {visit.availableSeats}/{visit.totalSeats} seats</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-zinc-700 text-zinc-400">{visit.visitType}</Badge>
                        {visit.published ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Published</Badge>
                        ) : (
                          <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">Draft</Badge>
                        )}
                        <Link href={`/admin/visits/${visit.id}`}>
                          <Button variant="ghost" size="sm" className="h-8">View</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-zinc-300">
                <MapPin className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                <div>
                  <p className="font-medium text-zinc-200">Headquarters</p>
                  <p className="text-zinc-400">{company.headquarters || company.location || "Not specified"}</p>
                </div>
              </div>

              {company.website && (
                <div className="flex items-start gap-3 text-zinc-300">
                  <Globe className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                  <div>
                    <p className="font-medium text-zinc-200">Website</p>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1">
                      {company.website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              {company.foundedYear && (
                <div className="flex items-start gap-3 text-zinc-300">
                  <Calendar className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                  <div>
                    <p className="font-medium text-zinc-200">Founded</p>
                    <p className="text-zinc-400">{company.foundedYear}</p>
                  </div>
                </div>
              )}

              {company.employeeCount && (
                <div className="flex items-start gap-3 text-zinc-300">
                  <Users className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                  <div>
                    <p className="font-medium text-zinc-200">Company Size</p>
                    <p className="text-zinc-400">{company.employeeCount} employees</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
