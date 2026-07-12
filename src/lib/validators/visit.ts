import { z } from "zod";

export const createVisitSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only")
    .optional(),
  description: z.string().optional(),
  visitType: z.enum(["INTERNSHIP", "PLACEMENT", "EVENT", "WORKSHOP", "OTHER"]),
  fee: z.number().min(0, "Fee cannot be negative"),
  totalSeats: z.number().int().min(1, "Must have at least 1 seat"),
  scheduledDate: z.string().optional(),
  registrationDeadline: z.string().optional(),
  duration: z.string().optional(),
  city: z.string().optional(),
  venue: z.string().optional(),
  meetingPoint: z.string().optional(),
  location: z.string().optional(),
  includes: z.array(z.string()).optional(),
  instructions: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  published: z.boolean(),
  // Eligibility
  minimumCGPA: z.number().min(0).max(10).optional().nullable(),
  maximumBacklogs: z.number().int().min(0).optional().nullable(),
  minimumSemester: z.number().int().min(1).max(10).optional().nullable(),
  graduationYear: z.number().int().min(2020).max(2035).optional().nullable(),
  allowedBranches: z.array(z.string()).optional(),
  allowedColleges: z.array(z.string()).optional(),
  genderRestriction: z.string().optional().nullable(),
});

export const updateVisitSchema = createVisitSchema.partial();

export type CreateVisitInput = z.infer<typeof createVisitSchema>;
export type UpdateVisitInput = z.infer<typeof updateVisitSchema>;
