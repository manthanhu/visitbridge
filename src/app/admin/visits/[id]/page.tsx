import { getVisitBySlug } from "@/app/actions/visit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, MapPin, Users, Calendar, Edit, Clock, IndianRupee, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import PublishToggle from "./publish-toggle";

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Try fetching by ID first (in case the admin routes use ID instead of slug)
  let visit = await prisma.company_visits.findUnique({
    where: { id },
    include: {
      companies: true,
      eligibilityRule: true,
      _count: {
        select: { visit_requests: true },
      },
    },
  });

  if (!visit) {
    notFound();
  }

  // Fetch applications
  const applications = await prisma.visit_requests.findMany({
    where: { visitId: visit.id },
    include: {
      students: {
        include: { user: true, colleges: true },
      },
    },
    orderBy: { appliedAt: "desc" },
  });

  const rule = visit.eligibilityRule;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/visits">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="border-zinc-700 text-zinc-400">{visit.visitType}</Badge>
              {visit.published ? (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Published</Badge>
              ) : (
                <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">Draft</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50">{visit.title}</h1>
            <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
              <Building2 className="h-4 w-4" />
              <Link href={`/admin/companies/${visit.companyId}`} className="hover:text-blue-400 hover:underline">
                {visit.companies?.name}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PublishToggle id={visit.id} initialPublished={visit.published} />
          <Link href={`/admin/visits/${visit.id}/edit`}>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <Edit className="mr-2 h-4 w-4" />
              Edit Visit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none text-zinc-300">
                {visit.description ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{visit.description}</p>
                ) : (
                  <p className="text-zinc-500 italic">No description provided.</p>
                )}
              </div>
              
              {visit.highlights && visit.highlights.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-zinc-200 mb-3">Highlights</h4>
                  <ul className="space-y-2">
                    {visit.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Applications Table */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-zinc-100 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" /> Applications
              </CardTitle>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {applications.length} / {visit.totalSeats} Filled
              </Badge>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-400">No applications yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-400 uppercase bg-zinc-800/50">
                      <tr>
                        <th className="px-4 py-3 font-medium">Student</th>
                        <th className="px-4 py-3 font-medium">College & Branch</th>
                        <th className="px-4 py-3 font-medium">CGPA</th>
                        <th className="px-4 py-3 font-medium">Applied Date</th>
                        <th className="px-4 py-3 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {applications.map((app: typeof applications[0]) => (
                        <tr key={app.id} className="hover:bg-zinc-800/30">
                          <td className="px-4 py-3">
                            <div className="font-medium text-zinc-200">{app.students.user.name}</div>
                            <div className="text-xs text-zinc-500">{app.students.user.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-zinc-300">{app.students.colleges?.name || app.students.college || "N/A"}</div>
                            <div className="text-xs text-zinc-500">{app.students.branch || "N/A"} • Sem {app.students.semester || "?"}</div>
                          </td>
                          <td className="px-4 py-3 text-zinc-300">{app.students.currentCgpa || "N/A"}</td>
                          <td className="px-4 py-3 text-zinc-400">
                            {format(new Date(app.appliedAt), "MMM d, yyyy")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Badge variant="outline" className={
                              app.status === "APPROVED" ? "border-emerald-500/50 text-emerald-400" :
                              app.status === "REJECTED" ? "border-red-500/50 text-red-400" :
                              app.status === "CANCELLED" ? "border-zinc-500/50 text-zinc-400" :
                              "border-blue-500/50 text-blue-400"
                            }>
                              {app.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Visit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-zinc-300">
                <Calendar className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                <div>
                  <p className="font-medium text-zinc-200">Date & Time</p>
                  <p className="text-zinc-400">
                    {visit.scheduledDate ? format(new Date(visit.scheduledDate), "MMM d, yyyy • h:mm a") : "To be announced"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-zinc-300">
                <Clock className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                <div>
                  <p className="font-medium text-zinc-200">Registration Deadline</p>
                  <p className={visit.registrationDeadline && new Date(visit.registrationDeadline) < new Date() ? "text-red-400" : "text-zinc-400"}>
                    {visit.registrationDeadline ? format(new Date(visit.registrationDeadline), "MMM d, yyyy • h:mm a") : "Open"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-zinc-300">
                <MapPin className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                <div>
                  <p className="font-medium text-zinc-200">Location</p>
                  <p className="text-zinc-400">{visit.venue || visit.city || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-zinc-300">
                <IndianRupee className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                <div>
                  <p className="font-medium text-zinc-200">Registration Fee</p>
                  <p className="text-zinc-400">{visit.fee > 0 ? `₹${visit.fee.toLocaleString()}` : "Free"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-zinc-300">
                <Users className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" />
                <div>
                  <p className="font-medium text-zinc-200">Capacity</p>
                  <p className="text-zinc-400">{visit.availableSeats} of {visit.totalSeats} seats available</p>
                  <div className="mt-2 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${((visit.totalSeats - visit.availableSeats) / visit.totalSeats) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 border-t-4 border-t-emerald-500">
            <CardHeader>
              <CardTitle className="text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Eligibility Rule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!rule || (rule.minimumCGPA === null && rule.maximumBacklogs === null && rule.minimumSemester === null && rule.graduationYear === null && rule.allowedBranches.length === 0 && rule.allowedColleges.length === 0 && (rule.genderRestriction === null || rule.genderRestriction === "ANY")) ? (
                <p className="text-zinc-400 italic">Open to all students. No restrictions applied.</p>
              ) : (
                <>
                  {rule.minimumCGPA !== null && (
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-400">Min CGPA</span>
                      <span className="font-medium text-zinc-200">{rule.minimumCGPA}</span>
                    </div>
                  )}
                  {rule.maximumBacklogs !== null && (
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-400">Max Backlogs</span>
                      <span className="font-medium text-zinc-200">{rule.maximumBacklogs}</span>
                    </div>
                  )}
                  {rule.minimumSemester !== null && (
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-400">Min Semester</span>
                      <span className="font-medium text-zinc-200">{rule.minimumSemester}</span>
                    </div>
                  )}
                  {rule.graduationYear !== null && (
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-400">Grad Year</span>
                      <span className="font-medium text-zinc-200">{rule.graduationYear}</span>
                    </div>
                  )}
                  {rule.genderRestriction !== null && rule.genderRestriction !== "ANY" && (
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-400">Gender</span>
                      <span className="font-medium text-zinc-200">{rule.genderRestriction}</span>
                    </div>
                  )}
                  {rule.allowedBranches.length > 0 && (
                    <div className="space-y-1 pb-2 border-b border-zinc-800">
                      <span className="text-zinc-400 block">Allowed Branches</span>
                      <div className="flex flex-wrap gap-1">
                        {rule.allowedBranches.map((b, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] py-0">{b}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {rule.allowedColleges.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-zinc-400 block">Allowed Colleges</span>
                      <div className="flex flex-wrap gap-1">
                        {rule.allowedColleges.map((c, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] py-0">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
