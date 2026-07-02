"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type OnboardingInput } from "@/lib/validators/onboarding";

export function PersonalStep() {
  const { register, formState: { errors } } = useFormContext<OnboardingInput>();
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Personal Information</h2>
      <p className="text-zinc-500">Let's start with the basics.</p>
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register("personal.name")} placeholder="John Doe" />
        {errors.personal?.name && <p className="text-sm text-red-500">{errors.personal.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" {...register("personal.phone")} placeholder="+1 234 567 890" />
        {errors.personal?.phone && <p className="text-sm text-red-500">{errors.personal.phone.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select 
            id="gender" 
            {...register("personal.gender")}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </select>
          {errors.personal?.gender && <p className="text-sm text-red-500">{errors.personal.gender.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" {...register("personal.dob")} />
          {errors.personal?.dob && <p className="text-sm text-red-500">{errors.personal.dob.message}</p>}
        </div>
      </div>
    </div>
  );
}

export function EducationStep() {
  const { register, formState: { errors } } = useFormContext<OnboardingInput>();
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Education</h2>
      <p className="text-zinc-500">Where are you currently studying?</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="university">University</Label>
          <Input id="university" {...register("education.university")} placeholder="e.g. Stanford University" />
          {errors.education?.university && <p className="text-sm text-red-500">{errors.education.university.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="college">College (if applicable)</Label>
          <Input id="college" {...register("education.college")} placeholder="e.g. College of Engineering" />
          {errors.education?.college && <p className="text-sm text-red-500">{errors.education.college.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Input id="degree" {...register("education.degree")} placeholder="e.g. B.Tech" />
          {errors.education?.degree && <p className="text-sm text-red-500">{errors.education.degree.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">Branch / Major</Label>
          <Input id="branch" {...register("education.branch")} placeholder="e.g. Computer Science" />
          {errors.education?.branch && <p className="text-sm text-red-500">{errors.education.branch.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="semester">Current Semester</Label>
          <Input id="semester" type="number" {...register("education.semester", { valueAsNumber: true })} placeholder="1-10" />
          {errors.education?.semester && <p className="text-sm text-red-500">{errors.education.semester.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="graduationYear">Graduation Year</Label>
          <Input id="graduationYear" type="number" {...register("education.graduationYear", { valueAsNumber: true })} placeholder="2026" />
          {errors.education?.graduationYear && <p className="text-sm text-red-500">{errors.education.graduationYear.message}</p>}
        </div>
      </div>
    </div>
  );
}

export function AcademicStep() {
  const { register, formState: { errors } } = useFormContext<OnboardingInput>();
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Academic Performance</h2>
      <p className="text-zinc-500">Your academic track record.</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentCgpa">Current CGPA</Label>
          <Input id="currentCgpa" type="number" step="0.01" {...register("academic.currentCgpa", { valueAsNumber: true })} placeholder="e.g. 8.5" />
          {errors.academic?.currentCgpa && <p className="text-sm text-red-500">{errors.academic.currentCgpa.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="backlogs">Active Backlogs</Label>
          <Input id="backlogs" type="number" {...register("academic.backlogs", { valueAsNumber: true })} placeholder="0" />
          {errors.academic?.backlogs && <p className="text-sm text-red-500">{errors.academic.backlogs.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tenthPercent">10th Percentage</Label>
          <Input id="tenthPercent" type="number" step="0.1" {...register("academic.tenthPercent", { valueAsNumber: true })} placeholder="e.g. 90.5" />
          {errors.academic?.tenthPercent && <p className="text-sm text-red-500">{errors.academic.tenthPercent.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="twelfthPercent">12th Percentage</Label>
          <Input id="twelfthPercent" type="number" step="0.1" {...register("academic.twelfthPercent", { valueAsNumber: true })} placeholder="e.g. 85.0" />
          {errors.academic?.twelfthPercent && <p className="text-sm text-red-500">{errors.academic.twelfthPercent.message}</p>}
        </div>
      </div>
    </div>
  );
}

export function ProfessionalStep() {
  const { register, formState: { errors } } = useFormContext<OnboardingInput>();
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Professional Links</h2>
      <p className="text-zinc-500">Help companies learn more about your work.</p>
      
      <div className="space-y-2">
        <Label htmlFor="linkedIn">LinkedIn URL</Label>
        <Input id="linkedIn" {...register("professional.linkedIn")} placeholder="https://linkedin.com/in/username" />
        {errors.professional?.linkedIn && <p className="text-sm text-red-500">{errors.professional.linkedIn.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="github">GitHub URL</Label>
        <Input id="github" {...register("professional.github")} placeholder="https://github.com/username" />
        {errors.professional?.github && <p className="text-sm text-red-500">{errors.professional.github.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio URL</Label>
        <Input id="portfolio" {...register("professional.portfolio")} placeholder="https://yourwebsite.com" />
        {errors.professional?.portfolio && <p className="text-sm text-red-500">{errors.professional.portfolio.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="resumeUrl">Resume URL (Google Drive / Notion)</Label>
        <Input id="resumeUrl" {...register("professional.resumeUrl")} placeholder="https://..." />
        {errors.professional?.resumeUrl && <p className="text-sm text-red-500">{errors.professional.resumeUrl.message}</p>}
      </div>
    </div>
  );
}

const AVAILABLE_SKILLS = ["Python", "Java", "C++", "React", "Node", "ML", "AI", "Cloud", "AWS", "Docker", "Kubernetes", "TypeScript", "Next.js", "SQL", "Go"];
const AVAILABLE_INTERESTS = ["AI", "Backend", "Frontend", "Cyber Security", "Cloud", "Data Science", "Embedded", "Mobile", "DevOps"];
const AVAILABLE_CITIES = ["Delhi", "Noida", "Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai", "Gurgaon"];
const DREAM_COMPANIES = ["Google", "Microsoft", "Amazon", "Adobe", "Flipkart", "NVIDIA", "Meta", "Apple", "Netflix"];

export function PreferencesStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<OnboardingInput>();
  
  const currentSkills = watch("preferences.skills") || [];
  const currentInterests = watch("preferences.interests") || [];
  const currentCities = watch("preferences.preferredCities") || [];
  const currentCompanies = watch("preferences.dreamCompanies") || [];

  const toggleArrayItem = (field: "preferences.skills" | "preferences.interests" | "preferences.preferredCities" | "preferences.dreamCompanies", current: string[], value: string) => {
    if (current.includes(value)) {
      setValue(field, current.filter(i => i !== value), { shouldValidate: true });
    } else {
      setValue(field, [...current, value], { shouldValidate: true });
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Preferences & Interests</h2>
      <p className="text-zinc-500">What are you looking for?</p>
      
      <div className="space-y-3">
        <Label>Top Skills</Label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SKILLS.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleArrayItem("preferences.skills", currentSkills, skill)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${currentSkills.includes(skill) ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}
            >
              {skill}
            </button>
          ))}
        </div>
        {errors.preferences?.skills && <p className="text-sm text-red-500">{errors.preferences.skills.message}</p>}
      </div>

      <div className="space-y-3">
        <Label>Areas of Interest</Label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_INTERESTS.map(interest => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleArrayItem("preferences.interests", currentInterests, interest)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${currentInterests.includes(interest) ? "bg-purple-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}
            >
              {interest}
            </button>
          ))}
        </div>
        {errors.preferences?.interests && <p className="text-sm text-red-500">{errors.preferences.interests.message}</p>}
      </div>

      <div className="space-y-3">
        <Label>Preferred Cities</Label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_CITIES.map(city => (
            <button
              key={city}
              type="button"
              onClick={() => toggleArrayItem("preferences.preferredCities", currentCities, city)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${currentCities.includes(city) ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}
            >
              {city}
            </button>
          ))}
        </div>
        {errors.preferences?.preferredCities && <p className="text-sm text-red-500">{errors.preferences.preferredCities.message}</p>}
      </div>

      <div className="space-y-3">
        <Label>Dream Companies</Label>
        <div className="flex flex-wrap gap-2">
          {DREAM_COMPANIES.map(company => (
            <button
              key={company}
              type="button"
              onClick={() => toggleArrayItem("preferences.dreamCompanies", currentCompanies, company)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${currentCompanies.includes(company) ? "bg-rose-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}
            >
              {company}
            </button>
          ))}
        </div>
        {errors.preferences?.dreamCompanies && <p className="text-sm text-red-500">{errors.preferences.dreamCompanies.message}</p>}
      </div>
    </div>
  );
}
