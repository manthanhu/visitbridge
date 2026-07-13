"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCompanySchema, type CreateCompanyInput } from "@/lib/validators/company";
import { createCompany } from "@/app/actions/company";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, ArrowLeft, Loader2, Globe, MapPin, Users } from "lucide-react";
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/companies"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-50">Add New Company</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Create a new company profile</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="px-4 py-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="rounded-xl border border-white/[0.04] bg-[#12121a] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Building2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">Basic Information</h3>
          </div>
          <div className="px-5 py-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name" className="text-xs text-zinc-400">Company Name *</Label>
              <Input
                id="name"
                {...register("name")}
                className="bg-white/[0.02] border-white/[0.06] text-zinc-100 focus:border-blue-500/40 placeholder:text-zinc-700"
                placeholder="e.g. Google"
              />
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-xs text-zinc-400">Industry</Label>
              <Input
                id="industry"
                {...register("industry")}
                className="bg-white/[0.02] border-white/[0.06] text-zinc-100 focus:border-blue-500/40 placeholder:text-zinc-700"
                placeholder="e.g. Technology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear" className="text-xs text-zinc-400">Founded Year</Label>
              <Input
                id="foundedYear"
                type="number"
                {...register("foundedYear", { valueAsNumber: true })}
                className="bg-white/[0.02] border-white/[0.06] text-zinc-100 focus:border-blue-500/40 placeholder:text-zinc-700"
                placeholder="e.g. 1998"
              />
              {errors.foundedYear && <p className="text-xs text-red-400">{errors.foundedYear.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="headquarters" className="text-xs text-zinc-400">Headquarters</Label>
              <Input
                id="headquarters"
                {...register("headquarters")}
                className="bg-white/[0.02] border-white/[0.06] text-zinc-100 focus:border-blue-500/40 placeholder:text-zinc-700"
                placeholder="e.g. Mountain View, CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCount" className="text-xs text-zinc-400">Employee Count</Label>
              <Input
                id="employeeCount"
                {...register("employeeCount")}
                className="bg-white/[0.02] border-white/[0.06] text-zinc-100 focus:border-blue-500/40 placeholder:text-zinc-700"
                placeholder="e.g. 100,000+"
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="rounded-xl border border-white/[0.04] bg-[#12121a] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Globe className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">Links & Media</h3>
          </div>
          <div className="px-5 py-5 grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="website" className="text-xs text-zinc-400">Website URL</Label>
              <Input
                id="website"
                {...register("website")}
                className="bg-white/[0.02] border-white/[0.06] text-zinc-100 focus:border-blue-500/40 placeholder:text-zinc-700"
                placeholder="https://..."
              />
              {errors.website && <p className="text-xs text-red-400">{errors.website.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl" className="text-xs text-zinc-400">Logo URL</Label>
              <Input
                id="logoUrl"
                {...register("logoUrl")}
                className="bg-white/[0.02] border-white/[0.06] text-zinc-100 focus:border-blue-500/40 placeholder:text-zinc-700"
                placeholder="https://..."
              />
              {errors.logoUrl && <p className="text-xs text-red-400">{errors.logoUrl.message}</p>}
              <p className="text-[11px] text-zinc-600">Direct link to the company logo image</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs text-zinc-400">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                className="bg-white/[0.02] border-white/[0.06] text-zinc-100 focus:border-blue-500/40 placeholder:text-zinc-700 min-h-[100px] resize-none"
                placeholder="Brief description of the company…"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/companies">
            <button
              type="button"
              className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/10 disabled:opacity-50"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
            ) : (
              <><Building2 className="h-4 w-4" /> Create Company</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
