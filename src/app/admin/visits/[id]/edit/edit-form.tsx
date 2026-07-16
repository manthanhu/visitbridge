"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVisitSchema, type UpdateVisitInput } from "@/lib/validators/visit";
import { updateVisit } from "@/app/actions/visit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Calendar, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { company_visits, EligibilityRule } from "@prisma/client";

type CompanyInfo = {
  id: string;
  name: string;
  industry: string | null;
};

type VisitWithEligibility = company_visits & {
  eligibilityRule: EligibilityRule | null;
};

// Helper for dates
const toDateTimeLocal = (date: Date | null) => {
  if (!date) return "";
  const d = new Date(date);
  // Adjust for timezone offset
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function EditVisitForm({ 
  visit,
  companies, 
}: { 
  visit: VisitWithEligibility,
  companies: CompanyInfo[],
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const rule = visit.eligibilityRule;
  const [allowedBranches, setAllowedBranches] = useState<string>(rule?.allowedBranches.join(", ") || "");
  const [allowedColleges, setAllowedColleges] = useState<string>(rule?.allowedColleges.join(", ") || "");
  const [includesList, setIncludesList] = useState<string>(visit.includes.join(", ") || "");
  const [highlightsList, setHighlightsList] = useState<string>(visit.highlights.join(", ") || "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateVisitInput>({
    resolver: zodResolver(updateVisitSchema),
    defaultValues: {
      title: visit.title,
      description: visit.description || undefined,
      visitType: visit.visitType as "INTERNSHIP" | "PLACEMENT" | "EVENT" | "WORKSHOP" | "OTHER",
      fee: visit.fee,
      totalSeats: visit.totalSeats,
      scheduledDate: toDateTimeLocal(visit.scheduledDate),
      registrationDeadline: toDateTimeLocal(visit.registrationDeadline),
      duration: visit.duration || undefined,
      city: visit.city || undefined,
      venue: visit.venue || undefined,
      meetingPoint: visit.meetingPoint || undefined,
      // Eligibility
      minimumCGPA: rule?.minimumCGPA,
      maximumBacklogs: rule?.maximumBacklogs,
      minimumSemester: rule?.minimumSemester,
      graduationYear: rule?.graduationYear,
      genderRestriction: rule?.genderRestriction,
    },
  });

  const onSubmit = async (data: UpdateVisitInput) => {
    setError(null);

    const formattedData = {
      ...data,
      allowedBranches: allowedBranches ? allowedBranches.split(",").map(s => s.trim()).filter(Boolean) : undefined,
      allowedColleges: allowedColleges ? allowedColleges.split(",").map(s => s.trim()).filter(Boolean) : undefined,
      includes: includesList ? includesList.split(",").map(s => s.trim()).filter(Boolean) : undefined,
      highlights: highlightsList ? highlightsList.split(",").map(s => s.trim()).filter(Boolean) : undefined,
    };

    const result = await updateVisit(visit.id, formattedData);
    
    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/admin/visits/${visit.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href={`/admin/visits/${visit.id}`}>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Edit Visit</h1>
          <p className="text-zinc-400 text-sm">Update {visit.title}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General Info */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" /> Basic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title" className="text-zinc-300">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500 text-lg py-6"
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title?.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Company</Label>
              <Input
                value={companies.find(c => c.id === visit.companyId)?.name || "Unknown"}
                disabled
                className="bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitType" className="text-zinc-300">Type</Label>
              <Controller
                control={control}
                name="visitType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectItem value="INTERNSHIP">Internship Drive</SelectItem>
                      <SelectItem value="PLACEMENT">Placement Drive</SelectItem>
                      <SelectItem value="EVENT">Event</SelectItem>
                      <SelectItem value="WORKSHOP">Workshop</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee" className="text-zinc-300">Registration Fee (₹)</Label>
              <Input
                id="fee"
                type="number"
                {...register("fee", { valueAsNumber: true })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalSeats" className="text-zinc-300">Total Seats</Label>
              <Input
                id="totalSeats"
                type="number"
                {...register("totalSeats", { valueAsNumber: true })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description" className="text-zinc-300">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500 min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="highlights" className="text-zinc-300">Highlights (comma-separated)</Label>
              <Input
                id="highlights"
                value={highlightsList}
                onChange={(e) => setHighlightsList(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Location */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" /> Schedule & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate" className="text-zinc-300">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                {...register("scheduledDate")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500 [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationDeadline" className="text-zinc-300">Registration Deadline</Label>
              <Input
                id="registrationDeadline"
                type="datetime-local"
                {...register("registrationDeadline")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500 [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-zinc-300">Duration</Label>
              <Input
                id="duration"
                {...register("duration")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-zinc-300">City</Label>
              <Input
                id="city"
                {...register("city")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="venue" className="text-zinc-300">Venue</Label>
              <Input
                id="venue"
                {...register("venue")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meetingPoint" className="text-zinc-300">Meeting Point</Label>
              <Input
                id="meetingPoint"
                {...register("meetingPoint")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="includes" className="text-zinc-300">Includes (comma-separated)</Label>
              <Input
                id="includes"
                value={includesList}
                onChange={(e) => setIncludesList(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Rules */}
        <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Eligibility Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minimumCGPA" className="text-zinc-300">Minimum CGPA (0-10)</Label>
              <Input
                id="minimumCGPA"
                type="number"
                step="0.01"
                {...register("minimumCGPA", { setValueAs: v => v === "" ? null : parseFloat(v) })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maximumBacklogs" className="text-zinc-300">Maximum Active Backlogs</Label>
              <Input
                id="maximumBacklogs"
                type="number"
                {...register("maximumBacklogs", { setValueAs: v => v === "" ? null : parseInt(v) })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumSemester" className="text-zinc-300">Minimum Semester</Label>
              <Input
                id="minimumSemester"
                type="number"
                {...register("minimumSemester", { setValueAs: v => v === "" ? null : parseInt(v) })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear" className="text-zinc-300">Required Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                {...register("graduationYear", { setValueAs: v => v === "" ? null : parseInt(v) })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="allowedBranches" className="text-zinc-300">Allowed Branches (comma-separated)</Label>
              <Input
                id="allowedBranches"
                value={allowedBranches}
                onChange={(e) => setAllowedBranches(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="allowedColleges" className="text-zinc-300">Allowed Colleges (comma-separated)</Label>
              <Input
                id="allowedColleges"
                value={allowedColleges}
                onChange={(e) => setAllowedColleges(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genderRestriction" className="text-zinc-300">Gender Restriction</Label>
              <Controller
                control={control}
                name="genderRestriction"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value || "ANY"}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-emerald-500">
                      <SelectValue placeholder="No restriction" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectItem value="ANY">No Restriction</SelectItem>
                      <SelectItem value="FEMALE">Female Only (Diversity Drive)</SelectItem>
                      <SelectItem value="MALE">Male Only</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 sticky bottom-4 p-4 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 shadow-xl">
          <Link href={`/admin/visits/${visit.id}`}>
            <Button type="button" variant="ghost" className="text-zinc-400 hover:text-zinc-100">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
