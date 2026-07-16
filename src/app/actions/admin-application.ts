"use server";

import { prisma, type TransactionClient } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

type VisitRequestWhereInput = NonNullable<
  NonNullable<Parameters<typeof prisma.visit_requests.findMany>[0]>["where"]
>;

export async function getApplications(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    const page = params.page || 1;
    const limit = params.limit || 15;
    const skip = (page - 1) * limit;

    const where: VisitRequestWhereInput = {};

    if (params.status && params.status !== "ALL") {
      where.status = params.status as NonNullable<VisitRequestWhereInput["status"]>;
    }

    if (params.search) {
      where.OR = [
        { students: { user: { name: { contains: params.search, mode: "insensitive" } } } },
        { students: { user: { email: { contains: params.search, mode: "insensitive" } } } },
        { company_visits: { title: { contains: params.search, mode: "insensitive" } } },
        { company_visits: { companies: { name: { contains: params.search, mode: "insensitive" } } } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.visit_requests.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedAt: "desc" },
        include: {
          students: {
            include: {
              user: true,
              colleges: true,
            },
          },
          company_visits: {
            include: { companies: true },
          },
        },
      }),
      prisma.visit_requests.count({ where }),
    ]);

    return {
      success: true,
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("getApplications error:", error);
    return { error: "Failed to fetch applications" };
  }
}

export async function approveApplication(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    const application = await prisma.visit_requests.findUnique({
      where: { id },
      include: {
        students: { include: { user: true } },
        company_visits: { include: { companies: true } },
      },
    });

    if (!application) return { error: "Application not found" };
    if (application.status === "APPROVED") return { error: "Application is already approved" };

    await prisma.$transaction(async (tx: TransactionClient) => {
      await tx.visit_requests.update({
        where: { id },
        data: {
          status: "APPROVED",
          approvedAt: new Date(),
        },
      });

      // Create notification for student
      await tx.notifications.create({
        data: {
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId: application.students.user.id,
          title: "Application Approved! 🎉",
          message: `Your application for "${application.company_visits.title}" at ${application.company_visits.companies.name} has been approved.`,
          type: "success",
          link: `/visits/${application.company_visits.slug || application.company_visits.id}`,
        },
      });
    });

    revalidatePath("/admin/applications");
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath(`/admin/visits/${application.visitId}`);
    return { success: true };
  } catch (error) {
    console.error("approveApplication error:", error);
    return { error: "Failed to approve application" };
  }
}

export async function rejectApplication(id: string, reason?: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as unknown as { role?: string })?.role;
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    const application = await prisma.visit_requests.findUnique({
      where: { id },
      include: {
        students: { include: { user: true } },
        company_visits: { include: { companies: true } },
      },
    });

    if (!application) return { error: "Application not found" };
    if (application.status === "REJECTED") return { error: "Application is already rejected" };

    await prisma.$transaction(async (tx: TransactionClient) => {
      await tx.visit_requests.update({
        where: { id },
        data: {
          status: "REJECTED",
          notes: reason || null,
        },
      });

      // Increment available seats back
      if (application.status === "PENDING" || application.status === "APPROVED") {
        await tx.company_visits.update({
          where: { id: application.visitId },
          data: { availableSeats: { increment: 1 } },
        });
      }

      // Create notification for student
      await tx.notifications.create({
        data: {
          id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId: application.students.user.id,
          title: "Application Update",
          message: `Your application for "${application.company_visits.title}" at ${application.company_visits.companies.name} was not approved.${reason ? ` Reason: ${reason}` : ""}`,
          type: "warning",
          link: `/visits/${application.company_visits.slug || application.company_visits.id}`,
        },
      });
    });

    revalidatePath("/admin/applications");
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath(`/admin/visits/${application.visitId}`);
    return { success: true };
  } catch (error) {
    console.error("rejectApplication error:", error);
    return { error: "Failed to reject application" };
  }
}
