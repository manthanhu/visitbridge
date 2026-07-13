"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getStudents(params: {
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = (session?.user as any)?.role;
    if (userRole !== "ADMIN") {
      return { error: "Unauthorized: Admin access required" };
    }

    const page = params.page || 1;
    const limit = params.limit || 15;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      where.OR = [
        { user: { name: { contains: params.search, mode: "insensitive" } } },
        { user: { email: { contains: params.search, mode: "insensitive" } } },
        { college: { contains: params.search, mode: "insensitive" } },
        { branch: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.studentProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          colleges: true,
          _count: {
            select: { visit_requests: true },
          },
        },
      }),
      prisma.studentProfile.count({ where }),
    ]);

    return {
      success: true,
      students,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("getStudents error:", error);
    return { error: "Failed to fetch students" };
  }
}
