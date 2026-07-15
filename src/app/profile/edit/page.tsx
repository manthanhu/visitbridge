import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { EditProfileClient } from "./client";

export default async function EditProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: {
        include: {
          skills: { include: { skill: true } },
          interests: { include: { interest: true } },
          resume: true,
        },
      },
    },
  });

  if (!user?.studentProfile) {
    redirect("/onboarding");
  }

  const profile = user.studentProfile;
  const resume = profile.resume;

  const defaultValues = {
    personal: {
      name: user.name,
      phone: profile.phone,
      gender: profile.gender,
      dob: profile.dob ? profile.dob.toISOString().split("T")[0] : "",
    },
    education: {
      university: profile.university,
      college: profile.college,
      degree: profile.degree,
      branch: profile.branch,
      semester: profile.semester,
      graduationYear: profile.graduationYear,
    },
    academic: {
      currentCgpa: profile.currentCgpa,
      tenthPercent: profile.tenthPercent,
      twelfthPercent: profile.twelfthPercent,
      backlogs: profile.backlogs,
    },
    professional: {
      resumeUrl: resume?.url || "",
      resumeFileName: resume?.fileName || "",
      linkedIn: profile.linkedIn || "",
      github: profile.github || "",
      portfolio: profile.portfolio || "",
    },
    preferences: {
      skills: profile.skills.map((s) => s.skill.name),
      interests: profile.interests.map((i) => i.interest.name),
      preferredCities: profile.preferredCities,
      dreamCompanies: profile.dreamCompanies,
    },
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 pt-12 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Profile</h1>
        <p className="text-zinc-500">Update your details to stand out to top companies.</p>
      </div>
      <EditProfileClient defaultValues={defaultValues} />
    </div>
  );
}
