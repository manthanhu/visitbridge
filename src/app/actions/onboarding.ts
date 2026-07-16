"use server";

import { prisma, type TransactionClient } from "@/lib/prisma";
import { onboardingSchema, type OnboardingInput } from "@/lib/validators/onboarding";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitOnboarding(data: OnboardingInput) {
  try {
    // 1. Verify user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // 2. Validate input against Zod schema
    const parsedData = onboardingSchema.safeParse(data);
    
    if (!parsedData.success) {
      return { error: "Invalid form data. Please check all fields." };
    }

    const { personal, education, academic, professional, preferences } = parsedData.data;

    // 3. Create skills and interests (upsert to avoid duplicates)
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

    // 4. Completion percentage — full onboarding = 100%
    const completionPercentage = 100;
    
    // 5. Use Prisma transaction to create the profile and update the user
    await prisma.$transaction(async (tx: TransactionClient) => {
      // Create the Student Profile
      const profile = await tx.studentProfile.create({
        data: {
          userId: session.user.id,
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
          completionPercentage,
        },
      });

      // Create Skills mapping
      if (skillIds.length > 0) {
        await tx.studentSkill.createMany({
          data: skillIds.map((skillId: string) => ({
            studentId: profile.id,
            skillId,
          })),
        });
      }

      // Create Interests mapping
      if (interestIds.length > 0) {
        await tx.studentInterest.createMany({
          data: interestIds.map((interestId: string) => ({
            studentId: profile.id,
            interestId,
          })),
        });
      }

      // Create Resume if provided
      if (professional.resumeUrl && professional.resumeFileName) {
        await tx.resume.create({
          data: {
            studentId: profile.id,
            url: professional.resumeUrl,
            fileName: professional.resumeFileName,
          },
        });
      }

      // Update User to mark profile as complete
      await tx.user.update({
        where: { id: session.user.id },
        data: { isProfileComplete: true },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Onboarding Error:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { error: "A profile for this user already exists." };
    }
    return { error: `Error: ${error instanceof Error ? error.message : String(error)}` };
  }
}
