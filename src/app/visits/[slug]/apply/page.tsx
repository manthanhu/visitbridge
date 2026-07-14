import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { checkEligibility } from "@/lib/eligibility";
import { ArrowLeft, Building2 } from "lucide-react";
import ApplicationFormClient from "./application-form-client";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/sign-in");
  }

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

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!studentProfile) {
    redirect("/onboarding");
  }

  // Check if already applied
  const existingApplication = await prisma.visit_requests.findUnique({
    where: {
      studentId_visitId: {
        studentId: studentProfile.id,
        visitId: visit.id,
      },
    },
  });

  if (existingApplication && existingApplication.status !== "CANCELLED") {
    redirect(`/dashboard/applications`);
  }

  // Verify eligibility again securely
  const profileData = {
    currentCgpa: studentProfile.currentCgpa,
    backlogs: studentProfile.backlogs,
    semester: studentProfile.semester,
    graduationYear: studentProfile.graduationYear,
    branch: studentProfile.branch,
    college: studentProfile.college,
    gender: studentProfile.gender,
  };
  
  const eligibility = checkEligibility(profileData, visit.eligibilityRule);

  if (!eligibility.eligible) {
    redirect(`/visits/${visit.slug || visit.id}`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
      <nav className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4 sm:px-6 lg:px-8">
          <Link href={`/visits/${visit.slug || visit.id}`} className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Visit Details
          </Link>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-800">
          <div className="h-16 w-16 rounded-xl bg-black border border-zinc-800 flex items-center justify-center p-2 shrink-0 shadow-lg">
            {visit.companies.logoUrl ? (
              <img src={visit.companies.logoUrl} alt={visit.companies.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="h-8 w-8 text-zinc-500" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
              Apply to {visit.companies.name}
            </h1>
            <p className="text-zinc-400">
              {visit.title}
            </p>
          </div>
        </div>

        <ApplicationFormClient 
          visitId={visit.id} 
          studentProfile={{
            phone: studentProfile.phone || "",
            college: studentProfile.college || "",
            branch: studentProfile.branch || "",
            semester: studentProfile.semester?.toString() || "",
            linkedIn: studentProfile.linkedIn || "",
            github: studentProfile.github || "",
          }}
        />

      </main>
    </div>
  );
}
