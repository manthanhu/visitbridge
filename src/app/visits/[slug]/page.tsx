import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { checkEligibility } from "@/lib/eligibility";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, Building2, MapPin, Users, Calendar, 
  Clock, IndianRupee, CheckCircle2, XCircle, Info,
  Globe, GraduationCap, Briefcase, Camera, Timer
} from "lucide-react";
import ApplyButton from "./apply-button";

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  // Find the visit by slug (or id as fallback)
  const visit = await prisma.company_visits.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      published: true,
      deletedAt: null,
    },
    include: {
      companies: true,
      eligibilityRule: true,
    },
  });

  if (!visit) {
    notFound();
  }

  // Get student profile
  let studentProfile = null;
  if (session?.user) {
    studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });
  }

  // Check if already applied
  let existingApplication = null;
  if (studentProfile) {
    existingApplication = await prisma.visit_requests.findUnique({
      where: {
        studentId_visitId: {
          studentId: studentProfile.id,
          visitId: visit.id,
        },
      },
    });
  }

  const hasApplied = existingApplication && existingApplication.status !== "CANCELLED";

  // Check eligibility
  let eligibility = null;
  if (studentProfile) {
    const profileData = {
      currentCgpa: studentProfile.currentCgpa,
      backlogs: studentProfile.backlogs,
      semester: studentProfile.semester,
      graduationYear: studentProfile.graduationYear,
      branch: studentProfile.branch,
      college: studentProfile.college,
      gender: studentProfile.gender,
    };
    eligibility = checkEligibility(profileData, visit.eligibilityRule);
  }
  
  const isFull = visit.availableSeats <= 0;
  const isDeadlinePassed = visit.registrationDeadline && new Date(visit.registrationDeadline) < new Date();
  
  const canApply = eligibility?.eligible && !isFull && !isDeadlinePassed && !hasApplied;

  // Calculate countdown
  let daysLeft = 0;
  let hoursLeft = 0;
  if (visit.registrationDeadline) {
    const diffTime = Math.abs(new Date(visit.registrationDeadline).getTime() - new Date().getTime());
    daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    hoursLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  }

  const fillPercentage = ((visit.totalSeats - visit.availableSeats) / visit.totalSeats) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/visits">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Visits
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner area */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900/40 via-zinc-900 to-zinc-950 border border-zinc-800 mb-8 p-8 md:p-12">
          {/* Subtle noise pattern */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-zinc-950 flex items-center justify-center shrink-0 border-2 border-zinc-800 shadow-2xl">
              {visit.companies.logoUrl ? (
                <img src={visit.companies.logoUrl} alt={visit.companies.name} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              ) : (
                <Building2 className="h-12 w-12 text-zinc-500" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-transparent">
                  {visit.visitType}
                </Badge>
                {visit.companies.industry && (
                  <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                    {visit.companies.industry}
                  </Badge>
                )}
                {hasApplied && (
                  <Badge className="bg-emerald-500 text-white border-transparent">
                    Applied
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
                {visit.title}
              </h1>
              
              <div className="flex items-center gap-2 text-zinc-400 text-lg">
                <span>with</span>
                <span className="font-semibold text-zinc-200">{visit.companies.name}</span>
                {visit.city && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {visit.city}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-bold text-zinc-50 mb-4">About this Opportunity</h2>
              <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-zinc-300">
                {visit.description ? (
                  <p className="whitespace-pre-wrap">{visit.description}</p>
                ) : (
                  <p className="italic text-zinc-500">No details provided.</p>
                )}
              </div>
            </section>

            {/* Highlights & Includes */}
            <div className="grid sm:grid-cols-2 gap-6">
              {visit.highlights && visit.highlights.length > 0 && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-zinc-200 mb-4 uppercase tracking-wider">Highlights</h3>
                    <ul className="space-y-3">
                      {visit.highlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-300">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {visit.includes && visit.includes.length > 0 && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-zinc-200 mb-4 uppercase tracking-wider">What's Included</h3>
                    <ul className="space-y-3">
                      {visit.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-300">
                          <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* About Company */}
            <section>
              <h2 className="text-xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-zinc-400" /> About {visit.companies.name}
              </h2>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  {visit.companies.description ? (
                    <p className="text-zinc-300 leading-relaxed mb-6">{visit.companies.description}</p>
                  ) : (
                    <p className="text-zinc-500 italic mb-6">No company description available.</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {visit.companies.foundedYear && (
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Founded</p>
                        <p className="text-zinc-200 font-medium">{visit.companies.foundedYear}</p>
                      </div>
                    )}
                    {visit.companies.employeeCount && (
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Company Size</p>
                        <p className="text-zinc-200 font-medium">{visit.companies.employeeCount}</p>
                      </div>
                    )}
                    {visit.companies.headquarters && (
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Headquarters</p>
                        <p className="text-zinc-200 font-medium">{visit.companies.headquarters}</p>
                      </div>
                    )}
                    {visit.companies.website && (
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Website</p>
                        <a href={visit.companies.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                          Visit Site <Globe className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Gallery Placeholder */}
            <section>
              <h2 className="text-xl font-bold text-zinc-50 mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5 text-zinc-400" /> Facility Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Camera className="h-8 w-8 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden sticky top-24">
              <div className="bg-zinc-800/50 p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-400 text-sm">Registration Fee</span>
                  <span className="text-2xl font-bold text-white flex items-center">
                    {visit.fee > 0 ? (
                      <>
                        <IndianRupee className="h-5 w-5 mr-1" />
                        {visit.fee.toLocaleString()}
                      </>
                    ) : (
                      "Free"
                    )}
                  </span>
                </div>
                
                <div className="mt-6">
                  {hasApplied ? (
                    <div className="w-full text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5" /> You have applied
                    </div>
                  ) : isFull ? (
                    <div className="w-full text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                      All Seats Filled
                    </div>
                  ) : isDeadlinePassed ? (
                    <div className="w-full text-center p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 font-medium">
                      Registration Closed
                    </div>
                  ) : !session?.user ? (
                    <Link href="/sign-in" className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Sign in to Apply</Button>
                    </Link>
                  ) : (
                    <div className="space-y-4">
                      {eligibility?.eligible ? (
                        <Link href={`/visits/${visit.slug || visit.id}/apply`} className="w-full block">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                            Proceed to Application
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="w-full bg-zinc-800 text-zinc-500 cursor-not-allowed">
                          Not Eligible
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Date & Time</p>
                    <p className="text-sm text-zinc-400">
                      {visit.scheduledDate ? format(new Date(visit.scheduledDate), "EEEE, MMMM d, yyyy") : "To be announced"}
                      {visit.scheduledDate && <br/>}
                      {visit.scheduledDate && format(new Date(visit.scheduledDate), "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Venue</p>
                    <p className="text-sm text-zinc-400">{visit.venue || visit.city || "To be announced"}</p>
                    {visit.meetingPoint && (
                      <p className="text-xs text-zinc-500 mt-1">
                        Meeting point: {visit.meetingPoint}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-purple-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Duration</p>
                    <p className="text-sm text-zinc-400">{visit.duration || "Not specified"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-orange-500 shrink-0" />
                  <div className="w-full">
                    <p className="text-sm font-medium text-zinc-200 flex justify-between">
                      <span>Seats Filled</span>
                      <span>{Math.round(fillPercentage)}%</span>
                    </p>
                    <div className="mt-2 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          fillPercentage > 90 ? 'bg-red-500' : fillPercentage > 75 ? 'bg-orange-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 text-right">{visit.availableSeats} seats remaining</p>
                  </div>
                </div>

                {visit.registrationDeadline && !isDeadlinePassed && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 mt-4">
                    <Timer className="h-5 w-5 text-orange-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-orange-400">Registration Closes In</p>
                      <p className="text-sm text-orange-300/80 font-mono mt-1">
                        {daysLeft}d {hoursLeft}h
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Eligibility Card */}
            {session?.user && eligibility ? (
              <Card className={`bg-zinc-900 border-zinc-800 border-l-4 ${eligibility.eligible ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-1 mb-4">
                    <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                      Eligibility Check
                      {eligibility.eligible ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ml-auto">Eligible</Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 ml-auto">Not Eligible</Badge>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-500">Based on your student profile</p>
                  </div>

                  {eligibility.checks.length === 0 ? (
                    <p className="text-sm text-zinc-400 flex items-center gap-2">
                      <Info className="h-4 w-4" /> Open to all students
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {eligibility.checks.map((check, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          {check.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className={`font-medium ${check.passed ? 'text-zinc-200' : 'text-zinc-300'}`}>
                              {check.label}
                            </p>
                            <p className={`text-xs ${check.passed ? 'text-zinc-500' : 'text-red-400'}`}>
                              {check.reason}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {!eligibility.eligible && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <p className="text-xs text-zinc-500 text-center">
                        Your profile does not meet one or more criteria for this visit. 
                        <Link href="/profile" className="text-blue-400 hover:underline ml-1">
                          Update your profile
                        </Link>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-1 mb-4">
                    <h3 className="text-lg font-bold text-zinc-100">
                      Eligibility Check
                    </h3>
                    <p className="text-xs text-zinc-500">Sign in to check if your profile meets the criteria</p>
                  </div>
                  <Link href="/sign-in" className="w-full">
                    <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300">Sign in to check eligibility</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
