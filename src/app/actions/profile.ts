"use server";

import { prisma, type TransactionClient } from "@/lib/prisma";
import { onboardingSchema, type OnboardingInput } from "@/lib/validators/onboarding";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: OnboardingInput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const parsedData = onboardingSchema.safeParse(data);
    
    if (!parsedData.success) {
      return { error: "Invalid form data. Please check all fields." };
    }

    const { personal, education, academic, professional, preferences } = parsedData.data;

    const skillIds = await Promise.all(
      preferences.skills.map(async (skillName) => {
        const skill = await prisma.skill.upsert({
          where: { name: skillName },
          update: {},
          create: { name: skillName },
        });
        return skill.id;
      })
    );

    const interestIds = await Promise.all(
      preferences.interests.map(async (interestName) => {
        const interest = await prisma.interest.upsert({
          where: { name: interestName },
          update: {},
          create: { name: interestName },
        });
        return interest.id;
      })
    );

    await prisma.$transaction(async (tx: TransactionClient) => {
      // Find existing profile
      const existingProfile = await tx.studentProfile.findUnique({
        where: { userId: session.user.id }
      });
      
      if (!existingProfile) {
        throw new Error("Profile not found.");
      }

      // Update the Student Profile
      const profile = await tx.studentProfile.update({
        where: { id: existingProfile.id },
        data: {
          phone: personal.phone,
          gender: personal.gender,
          dob: new Date(personal.dob),
          university: education.university,
          college: education.college,
          degree: education.degree,
          branch: education.branch,
          semester: education.semester,
          graduationYear: education.graduationYear,
          currentCgpa: academic.currentCgpa,
          tenthPercent: academic.tenthPercent,
          twelfthPercent: academic.twelfthPercent,
          backlogs: academic.backlogs,
          linkedIn: professional.linkedIn || null,
          github: professional.github || null,
          portfolio: professional.portfolio || null,
          preferredCities: preferences.preferredCities,
          dreamCompanies: preferences.dreamCompanies,
        },
      });

      // Update Skills mapping
      await tx.studentSkill.deleteMany({ where: { studentId: profile.id } });
      if (skillIds.length > 0) {
        await tx.studentSkill.createMany({
          data: skillIds.map((skillId) => ({
            studentId: profile.id,
            skillId,
          })),
        });
      }

      // Update Interests mapping
      await tx.studentInterest.deleteMany({ where: { studentId: profile.id } });
      if (interestIds.length > 0) {
        await tx.studentInterest.createMany({
          data: interestIds.map((interestId) => ({
            studentId: profile.id,
            interestId,
          })),
        });
      }

      // Update Resume if provided
      if (professional.resumeUrl && professional.resumeFileName) {
        const existingResume = await tx.resume.findUnique({ where: { studentId: profile.id } });
        if (existingResume) {
          await tx.resume.update({
            where: { id: existingResume.id },
            data: { url: professional.resumeUrl, fileName: professional.resumeFileName }
          });
        } else {
          await tx.resume.create({
            data: { studentId: profile.id, url: professional.resumeUrl, fileName: professional.resumeFileName }
          });
        }
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Update Profile Error:", error);
    return { error: `Error: ${error instanceof Error ? error.message : String(error)}` };
  }
}
