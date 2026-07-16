"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkEligibility } from "@/lib/eligibility";
import { revalidatePath } from "next/cache";

export async function applyToVisit(visitId: string, additionalData?: any) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized: Please sign in" };
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return { error: "Student profile not found. Please complete your onboarding." };
    }

    const visit = await prisma.company_visits.findUnique({
      where: { id: visitId },
      include: { eligibilityRule: true },
    });

    if (!visit || visit.deletedAt || !visit.published) {
      return { error: "Visit is not available" };
    }

    if (visit.registrationDeadline && new Date(visit.registrationDeadline) < new Date()) {
      return { error: "Registration deadline has passed" };
    }

    if (visit.availableSeats <= 0) {
      return { error: "This visit is already full" };
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
      return { error: "You have already applied for this visit" };
    }

    // Eligibility check
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
      const failedReasons = eligibility.checks
        .filter((c) => !c.passed)
        .map((c) => c.reason)
        .join(", ");
      return { error: `You do not meet the eligibility criteria: ${failedReasons}` };
    }

    // Process application in a transaction to prevent race conditions
    await prisma.$transaction(async (tx: import("@/lib/prisma").TransactionClient) => {
      // Re-fetch to ensure seats haven't been taken in the split second
      const currentVisit = await tx.company_visits.findUnique({
        where: { id: visit.id },
        select: { availableSeats: true },
      });

      if (!currentVisit || currentVisit.availableSeats <= 0) {
        throw new Error("SEATS_FILLED");
      }

      if (existingApplication) {
        await tx.visit_requests.update({
          where: { id: existingApplication.id },
          data: {
            status: "APPROVED",
            appliedAt: new Date(),
            requestedAt: new Date(),
            cancelledAt: null,
            notes: additionalData ? JSON.stringify(additionalData) : null,
          },
        });
      } else {
        await tx.visit_requests.create({
          data: {
            studentId: studentProfile.id,
            visitId: visit.id,
            status: "APPROVED", // Auto-approve if eligible, or keep PENDING and let Admin approve? The flow says: Eligibility Check -> Application Form -> Payment. I'll set it to APPROVED so they can pay immediately.
            appliedAt: new Date(),
            requestedAt: new Date(),
            notes: additionalData ? JSON.stringify(additionalData) : null,
          },
        });
      }

      const updatedVisit = await tx.company_visits.update({
        where: { id: visit.id },
        data: {
          availableSeats: { decrement: 1 },
        },
      });

      // If seats become 0, update status to THRESHOLD_REACHED or similar
      if (updatedVisit.availableSeats === 0) {
        await tx.company_visits.update({
          where: { id: visit.id },
          data: { status: "THRESHOLD_REACHED" },
        });
      }
    });

    revalidatePath("/visits");
    revalidatePath(`/visits/${visit.slug || visit.id}`);
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    if ((error instanceof Error ? error.message : String(error)) === "SEATS_FILLED") {
      return { error: "Sorry, all seats were just filled." };
    }
    console.error("applyToVisit error:", error);
    return { error: "Failed to apply to visit" };
  }
}

export async function cancelApplication(applicationId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) return { error: "Profile not found" };

    const application = await prisma.visit_requests.findUnique({
      where: { id: applicationId },
      include: { company_visits: true },
    });

    if (!application) return { error: "Application not found" };

    if (application.studentId !== studentProfile.id) {
      return { error: "Unauthorized to cancel this application" };
    }

    if (application.status === "CANCELLED") {
      return { error: "Application is already cancelled" };
    }

    await prisma.$transaction(async (tx: import("@/lib/prisma").TransactionClient) => {
      await tx.visit_requests.update({
        where: { id: applicationId },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
      });

      await tx.company_visits.update({
        where: { id: application.visitId },
        data: {
          availableSeats: { increment: 1 },
        },
      });
      
      // If visit was full, it's now open again
      if (application.company_visits.availableSeats === 0) {
        await tx.company_visits.update({
          where: { id: application.visitId },
          data: { status: "OPEN" },
        });
      }
    });

    revalidatePath("/visits");
    revalidatePath(`/visits/${application.company_visits.slug || application.company_visits.id}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("cancelApplication error:", error);
    return { error: "Failed to cancel application" };
  }
}

export async function getMyApplications() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { success: true, applications: [] };

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) return { success: true, applications: [] };

    const applications = await prisma.visit_requests.findMany({
      where: { studentId: studentProfile.id },
      include: {
        company_visits: {
          include: { companies: true },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    return { success: true, applications };
  } catch (error) {
    console.error("getMyApplications error:", error);
    return { error: "Failed to fetch applications" };
  }
}
