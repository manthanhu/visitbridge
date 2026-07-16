"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createCompanySchema, type CreateCompanyInput, type UpdateCompanyInput } from "@/lib/validators/company";
import { revalidatePath } from "next/cache";

export async function createCompany(data: CreateCompanyInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as unknown as { role?: string })?.role;
    
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    const result = createCompanySchema.safeParse(data);
    if (!result.success) {
      return { error: "Validation failed: " + result.error.issues[0].message };
    }

    let { slug, ...rest } = result.data;
    if (!slug) {
      slug = rest.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    const company = await prisma.companies.create({
      data: {
        ...rest,
        slug,
      },
    });

    revalidatePath("/admin/companies");
    return { success: true, company };
  } catch (error) {
    if ((error && typeof error === "object" && "code" in error ? error.code : undefined) === "P2002") {
      return { error: "A company with this slug or name already exists" };
    }
    console.error("createCompany error:", error);
    return { error: "Failed to create company" };
  }
}

export async function updateCompany(id: string, data: UpdateCompanyInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as unknown as { role?: string })?.role;
    
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    await prisma.companies.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/companies");
    revalidatePath(`/admin/companies/${id}`);
    return { success: true };
  } catch (error) {
    console.error("updateCompany error:", error);
    return { error: "Failed to update company" };
  }
}

export async function deleteCompany(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as unknown as { role?: string })?.role;
    
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    await prisma.companies.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/admin/companies");
    return { success: true };
  } catch (error) {
    console.error("deleteCompany error:", error);
    return { error: "Failed to delete company" };
  }
}

export async function getCompanies(params: { search?: string; page?: number; limit?: number } = {}) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: import("@prisma/client").Prisma.visit_requestsWhereInput | Record<string, any> = {
      deletedAt: null,
      isActive: true,
    };

    if (params.search) {
      where.name = { contains: params.search, mode: "insensitive" };
    }

    const [companies, total] = await Promise.all([
      prisma.companies.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { company_visits: true },
          },
        },
      }),
      prisma.companies.count({ where }),
    ]);

    return {
      success: true,
      companies,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("getCompanies error:", error);
    return { error: "Failed to fetch companies" };
  }
}

export async function getCompanyById(id: string) {
  try {
    const company = await prisma.companies.findUnique({
      where: { id },
      include: {
        _count: {
          select: { company_visits: true },
        },
      },
    });

    if (!company) {
      return { error: "Company not found" };
    }

    return { success: true, company };
  } catch (error) {
    console.error("getCompanyById error:", error);
    return { error: "Failed to fetch company" };
  }
}
