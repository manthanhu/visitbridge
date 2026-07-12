"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createVisitSchema, type CreateVisitInput, type UpdateVisitInput } from "@/lib/validators/visit";
import { revalidatePath } from "next/cache";

export async function createVisit(data: CreateVisitInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as any)?.role;
    
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    const result = createVisitSchema.safeParse(data);
    if (!result.success) {
      return { error: "Validation failed: " + result.error.issues[0].message };
    }

    const {
      minimumCGPA,
      maximumBacklogs,
      minimumSemester,
      graduationYear,
      allowedBranches,
      allowedColleges,
      genderRestriction,
      slug: providedSlug,
      ...visitData
    } = result.data;

    const slug = providedSlug || visitData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const visit = await prisma.$transaction(async (tx) => {
      const newVisit = await tx.company_visits.create({
        data: {
          ...visitData,
          slug,
          availableSeats: visitData.totalSeats,
          status: "OPEN",
        },
      });

      await tx.eligibilityRule.create({
        data: {
          visitId: newVisit.id,
          minimumCGPA,
          maximumBacklogs,
          minimumSemester,
          graduationYear,
          allowedBranches: allowedBranches || [],
          allowedColleges: allowedColleges || [],
          genderRestriction,
        },
      });

      return newVisit;
    });

    revalidatePath("/admin/visits");
    revalidatePath("/visits");
    return { success: true, visit };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "A visit with this slug already exists" };
    }
    console.error("createVisit error:", error);
    return { error: "Failed to create visit" };
  }
}

export async function updateVisit(id: string, data: UpdateVisitInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as any)?.role;
    
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    const {
      minimumCGPA,
      maximumBacklogs,
      minimumSemester,
      graduationYear,
      allowedBranches,
      allowedColleges,
      genderRestriction,
      ...visitData
    } = data;

    await prisma.$transaction(async (tx) => {
      if (Object.keys(visitData).length > 0) {
        await tx.company_visits.update({
          where: { id },
          data: visitData as any,
        });
      }

      const eligibilityData: any = {
        minimumCGPA,
        maximumBacklogs,
        minimumSemester,
        graduationYear,
        genderRestriction,
      };

      if (allowedBranches) eligibilityData.allowedBranches = allowedBranches;
      if (allowedColleges) eligibilityData.allowedColleges = allowedColleges;

      // Clean undefined keys
      Object.keys(eligibilityData).forEach((key) => eligibilityData[key] === undefined && delete eligibilityData[key]);

      if (Object.keys(eligibilityData).length > 0) {
        await tx.eligibilityRule.upsert({
          where: { visitId: id },
          update: eligibilityData,
          create: {
            visitId: id,
            minimumCGPA: minimumCGPA ?? null,
            maximumBacklogs: maximumBacklogs ?? null,
            minimumSemester: minimumSemester ?? null,
            graduationYear: graduationYear ?? null,
            allowedBranches: allowedBranches || [],
            allowedColleges: allowedColleges || [],
            genderRestriction: genderRestriction ?? null,
          },
        });
      }
    });

    revalidatePath("/admin/visits");
    revalidatePath(`/admin/visits/${id}`);
    revalidatePath("/visits");
    return { success: true };
  } catch (error) {
    console.error("updateVisit error:", error);
    return { error: "Failed to update visit" };
  }
}

export async function deleteVisit(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as any)?.role;
    
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    await prisma.company_visits.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/admin/visits");
    revalidatePath("/visits");
    return { success: true };
  } catch (error) {
    console.error("deleteVisit error:", error);
    return { error: "Failed to delete visit" };
  }
}

export async function togglePublish(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as any)?.role;
    
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    const visit = await prisma.company_visits.findUnique({
      where: { id },
      select: { published: true },
    });

    if (!visit) return { error: "Visit not found" };

    await prisma.company_visits.update({
      where: { id },
      data: { published: !visit.published },
    });

    revalidatePath("/admin/visits");
    revalidatePath(`/admin/visits/${id}`);
    revalidatePath("/visits");
    return { success: true, published: !visit.published };
  } catch (error) {
    console.error("togglePublish error:", error);
    return { error: "Failed to toggle publish status" };
  }
}

export async function getVisits(params: { search?: string; city?: string; companyId?: string; visitType?: any; published?: boolean; page?: number; limit?: number } = {}) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { companies: { name: { contains: params.search, mode: "insensitive" } } },
      ];
    }
    if (params.city) where.city = { contains: params.city, mode: "insensitive" };
    if (params.companyId) where.companyId = params.companyId;
    if (params.visitType) where.visitType = params.visitType;
    if (params.published !== undefined) where.published = params.published;

    const [visits, total] = await Promise.all([
      prisma.company_visits.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          companies: true,
          eligibilityRule: true,
        },
      }),
      prisma.company_visits.count({ where }),
    ]);

    return {
      success: true,
      visits,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("getVisits error:", error);
    return { error: "Failed to fetch visits" };
  }
}

export async function getVisitBySlug(slug: string) {
  try {
    const visit = await prisma.company_visits.findUnique({
      where: { slug },
      include: {
        companies: true,
        eligibilityRule: true,
        _count: {
          select: { visit_requests: true },
        },
      },
    });

    if (!visit || visit.deletedAt) {
      return { error: "Visit not found" };
    }

    return { success: true, visit };
  } catch (error) {
    console.error("getVisitBySlug error:", error);
    return { error: "Failed to fetch visit" };
  }
}
