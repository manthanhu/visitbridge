import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, Briefcase, GraduationCap, Globe, MapPin, Building2, Star, Settings } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      skills: { include: { skill: true } },
      interests: { include: { interest: true } },
      resume: true,
    },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/profile/edit">
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Left Column: Personal Info & Links */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl text-white font-bold mb-4 shadow-inner">
                {session.user.name?.charAt(0) || "U"}
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{session.user.name}</h1>
              <p className="text-zinc-500 dark:text-zinc-400">{session.user.email}</p>
              
              <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                {profile.phone && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Phone</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-300">{profile.phone}</span>
                  </div>
                )}
                {profile.gender && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Gender</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-300">{profile.gender}</span>
                  </div>
                )}
                {profile.dob && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Born</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-300">
                      {new Date(profile.dob).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Links */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-zinc-400" /> Professional
              </h2>
              <div className="space-y-4">
                {profile.linkedIn && (
                  <a href={profile.linkedIn} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-blue-600 hover:underline">
                    <Globe className="h-5 w-5" /> LinkedIn Profile
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300 hover:underline">
                    <Globe className="h-5 w-5" /> GitHub Profile
                  </a>
                )}
                {profile.portfolio && (
                  <a href={profile.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-emerald-600 hover:underline">
                    <Globe className="h-5 w-5" /> Portfolio Website
                  </a>
                )}
                {profile.resume && (
                  <a href={profile.resume.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-rose-600 hover:underline">
                    <Briefcase className="h-5 w-5" /> View Resume
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Education */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-500" /> Education
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">University</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-200">{profile.university || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">College</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-200">{profile.college || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Degree & Branch</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-200">{profile.degree} in {profile.branch}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Status</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-200">Sem {profile.semester} • Class of {profile.graduationYear}</p>
                </div>
              </div>
            </div>

            {/* Academic Stats */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" /> Academics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">CGPA</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{profile.currentCgpa || "N/A"}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">10th %</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{profile.tenthPercent || "N/A"}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">12th %</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{profile.twelfthPercent || "N/A"}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500 mb-1">Backlogs</p>
                  <p className="text-2xl font-bold text-red-500">{profile.backlogs}</p>
                </div>
              </div>
            </div>

            {/* Skills & Preferences */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Skills & Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Top Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s: typeof profile.skills[0]) => (
                      <span key={s.skillId} className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 rounded-full text-sm font-medium">
                        {s.skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((i: typeof profile.interests[0]) => (
                      <span key={i.interestId} className="px-3 py-1 bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 rounded-full text-sm font-medium">
                        {i.interest.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-500 flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4" /> Preferred Cities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferredCities.map((city: string) => (
                        <span key={city} className="text-sm text-zinc-700 dark:text-zinc-300">{city}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-500 flex items-center gap-2 mb-3">
                      <Building2 className="h-4 w-4" /> Dream Companies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.dreamCompanies.map((company: string) => (
                        <span key={company} className="text-sm text-zinc-700 dark:text-zinc-300">{company}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
