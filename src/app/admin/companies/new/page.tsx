"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCompanySchema, type CreateCompanyInput } from "@/lib/validators/company";
import { createCompany } from "@/app/actions/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewCompanyPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
  });

  const onSubmit = async (data: CreateCompanyInput) => {
    setError(null);
    const result = await createCompany(data);
    
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/admin/companies");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/companies">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Add New Company</h1>
          <p className="text-zinc-400 text-sm">Create a new company profile</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name" className="text-zinc-300">Company Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
                  placeholder="e.g. Google"
                />
                {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-zinc-300">Industry</Label>
                <Input
                  id="industry"
                  {...register("industry")}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
                  placeholder="e.g. Technology"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="foundedYear" className="text-zinc-300">Founded Year</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  {...register("foundedYear", { valueAsNumber: true })}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
                  placeholder="e.g. 1998"
                />
                {errors.foundedYear && <p className="text-xs text-red-400">{errors.foundedYear.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="headquarters" className="text-zinc-300">Headquarters</Label>
                <Input
                  id="headquarters"
                  {...register("headquarters")}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
                  placeholder="e.g. Mountain View, CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount" className="text-zinc-300">Employee Count</Label>
                <Input
                  id="employeeCount"
                  {...register("employeeCount")}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
                  placeholder="e.g. 100,000+"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="website" className="text-zinc-300">Website URL</Label>
                <Input
                  id="website"
                  {...register("website")}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
                  placeholder="https://..."
                />
                {errors.website && <p className="text-xs text-red-400">{errors.website.message}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="logoUrl" className="text-zinc-300">Logo URL</Label>
                <Input
                  id="logoUrl"
                  {...register("logoUrl")}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
                  placeholder="https://..."
                />
                {errors.logoUrl && <p className="text-xs text-red-400">{errors.logoUrl.message}</p>}
                <p className="text-xs text-zinc-500">Provide a direct link to the company logo image</p>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description" className="text-zinc-300">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500 min-h-[120px]"
                  placeholder="Brief description of the company..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
              <Link href="/admin/companies">
                <Button type="button" variant="ghost" className="text-zinc-400 hover:text-zinc-100">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Building2 className="mr-2 h-4 w-4" /> Create Company</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
