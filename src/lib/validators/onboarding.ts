import { z } from "zod";

export const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
    message: "Please select a gender",
  }),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
});

export const educationInfoSchema = z.object({
  university: z.string().min(2, "University name required"),
  college: z.string().min(2, "College name required"),
  degree: z.string().min(2, "Degree required"),
  branch: z.string().min(2, "Branch required"),
  semester: z.number().min(1).max(10, "Invalid semester"),
  graduationYear: z
    .number()
    .min(2020)
    .max(2035, "Invalid graduation year"),
});

export const academicInfoSchema = z.object({
  currentCgpa: z.number().min(0).max(10, "CGPA must be between 0 and 10"),
  tenthPercent: z.number().min(0).max(100, "Percentage must be between 0 and 100"),
  twelfthPercent: z.number().min(0).max(100, "Percentage must be between 0 and 100"),
  backlogs: z.number().min(0).default(0),
});

export const professionalInfoSchema = z.object({
  resumeUrl: z.string().url("Please upload a valid resume URL").optional().or(z.literal("")),
  resumeFileName: z.string().optional(),
  linkedIn: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
});

export const preferencesInfoSchema = z.object({
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  preferredCities: z.array(z.string()).min(1, "Select at least one preferred city"),
  dreamCompanies: z.array(z.string()).min(1, "Select at least one dream company"),
});

// The complete onboarding schema wraps everything
export const onboardingSchema = z.object({
  personal: personalInfoSchema,
  education: educationInfoSchema,
  academic: academicInfoSchema,
  professional: professionalInfoSchema,
  preferences: preferencesInfoSchema,
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type EducationInfoInput = z.infer<typeof educationInfoSchema>;
export type AcademicInfoInput = z.infer<typeof academicInfoSchema>;
export type ProfessionalInfoInput = z.infer<typeof professionalInfoSchema>;
export type PreferencesInfoInput = z.infer<typeof preferencesInfoSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
