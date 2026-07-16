"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVisitSchema, type CreateVisitInput } from "@/lib/validators/visit";
import { createVisit } from "@/app/actions/visit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, MapPin, Building2, Calendar, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CompanyInfo = {
  id: string;
  name: string;
  industry: string | null;
};

export default function VisitForm({ 
  companies, 
  initialCompanyId 
}: { 
  companies: CompanyInfo[],
  initialCompanyId?: string
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [allowedBranches, setAllowedBranches] = useState<string>("");
  const [allowedColleges, setAllowedColleges] = useState<string>("");
  const [includesList, setIncludesList] = useState<string>("");
  const [highlightsList, setHighlightsList] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateVisitInput>({
    resolver: zodResolver(createVisitSchema),
    defaultValues: {
      companyId: initialCompanyId || "",
      visitType: "INTERNSHIP",
      fee: 0,
      totalSeats: 50,
      published: false,
    },
  });

  const onSubmit = async (data: CreateVisitInput) => {
    setError(null);

    // Convert comma separated strings to arrays
    const formattedData = {
      ...data,
      allowedBranches: allowedBranches ? allowedBranches.split(",").map(s => s.trim()).filter(Boolean) : undefined,
      allowedColleges: allowedColleges ? allowedColleges.split(",").map(s => s.trim()).filter(Boolean) : undefined,
      includes: includesList ? includesList.split(",").map(s => s.trim()).filter(Boolean) : undefined,
      highlights: highlightsList ? highlightsList.split(",").map(s => s.trim()).filter(Boolean) : undefined,
    };

    const result = await createVisit(formattedData as unknown as CreateVisitInput);
    
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/admin/visits");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/visits">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Create Visit</h1>
          <p className="text-zinc-400 text-sm">Schedule a new visit or placement drive</p>
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
                placeholder="e.g. Google Cloud Summer Camp 2024"
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyId" className="text-zinc-300">Company *</Label>
              <Controller
                control={control}
                name="companyId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-blue-500">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      {companies.map((c: typeof companies[0]) => (
                        <SelectItem key={c.id} value={c.id} className="focus:bg-zinc-800 focus:text-zinc-50">
                          {c.name} {c.industry ? `(${c.industry})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.companyId && <p className="text-xs text-red-400">{errors.companyId.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitType" className="text-zinc-300">Type</Label>
              <Controller
                control={control}
                name="visitType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              {errors.totalSeats && <p className="text-xs text-red-400">{errors.totalSeats.message as string}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description" className="text-zinc-300">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500 min-h-[120px]"
                placeholder="What will students learn or do during this visit?"
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="highlights" className="text-zinc-300">Highlights (comma-separated)</Label>
              <Input
                id="highlights"
                value={highlightsList}
                onChange={(e) => setHighlightsList(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
                placeholder="e.g. Office Tour, Tech Talk, Networking Lunch"
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
                placeholder="e.g. 4 Hours, 2 Days"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-zinc-300">City</Label>
              <Input
                id="city"
                {...register("city")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500"
                placeholder="e.g. Bangalore"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="venue" className="text-zinc-300">Venue</Label>
              <Input
                id="venue"
                {...register("venue")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500"
                placeholder="Full address of the company or event location"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meetingPoint" className="text-zinc-300">Meeting Point</Label>
              <Input
                id="meetingPoint"
                {...register("meetingPoint")}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500"
                placeholder="e.g. College Main Gate"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="includes" className="text-zinc-300">Includes (comma-separated)</Label>
              <Input
                id="includes"
                value={includesList}
                onChange={(e) => setIncludesList(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-purple-500"
                placeholder="e.g. Transport, Lunch, Certificate"
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
                placeholder="e.g. 7.5"
              />
              {errors.minimumCGPA && <p className="text-xs text-red-400">{errors.minimumCGPA.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maximumBacklogs" className="text-zinc-300">Maximum Active Backlogs</Label>
              <Input
                id="maximumBacklogs"
                type="number"
                {...register("maximumBacklogs", { setValueAs: v => v === "" ? null : parseInt(v) })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
                placeholder="e.g. 0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumSemester" className="text-zinc-300">Minimum Semester</Label>
              <Input
                id="minimumSemester"
                type="number"
                {...register("minimumSemester", { setValueAs: v => v === "" ? null : parseInt(v) })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
                placeholder="e.g. 5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear" className="text-zinc-300">Required Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                {...register("graduationYear", { setValueAs: v => v === "" ? null : parseInt(v) })}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
                placeholder="e.g. 2025"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="allowedBranches" className="text-zinc-300">Allowed Branches (comma-separated)</Label>
              <Input
                id="allowedBranches"
                value={allowedBranches}
                onChange={(e) => setAllowedBranches(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
                placeholder="e.g. Computer Science, Information Technology, Electronics"
              />
              <p className="text-xs text-zinc-500">Leave empty to allow all branches</p>
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="allowedColleges" className="text-zinc-300">Allowed Colleges (comma-separated)</Label>
              <Input
                id="allowedColleges"
                value={allowedColleges}
                onChange={(e) => setAllowedColleges(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-emerald-500"
                placeholder="e.g. MIT, Stanford, IIT Bombay"
              />
              <p className="text-xs text-zinc-500">Leave empty to allow all colleges</p>
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
            
            <div className="space-y-2 flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("published")}
                  className="w-5 h-5 rounded border-zinc-700 bg-zinc-950 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                />
                <span className="text-zinc-200 font-medium">Publish immediately</span>
              </label>
              <p className="text-xs text-zinc-500 ml-8">Published visits are visible to students</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 sticky bottom-4 p-4 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 shadow-xl">
          <Link href="/admin/visits">
            <Button type="button" variant="ghost" className="text-zinc-400 hover:text-zinc-100">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              "Create Visit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
