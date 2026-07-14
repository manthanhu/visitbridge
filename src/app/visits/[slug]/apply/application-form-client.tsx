"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { applyToVisit } from "@/app/actions/application";
import { Loader2, AlertCircle, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

export default function ApplicationFormClient({
  visitId,
  studentProfile,
}: {
  visitId: string;
  studentProfile: {
    phone: string;
    college: string;
    branch: string;
    semester: string;
    linkedIn: string;
    github: string;
  };
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    emergencyContactName: "",
    emergencyContactPhone: "",
    additionalNotes: "",
    resumeUploaded: true, // We'll assume they uploaded via profile, or we mock it
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await applyToVisit(visitId, formData);
      if (res.error) {
        setError(res.error);
        toast.error(res.error);
      } else {
        toast.success("Application successful!");
        // The application is now APPROVED automatically because they were eligible.
        // Redirect them to payment page!
        router.push(`/visits/${visitId}/payment`);
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/50 p-6 sm:p-8 rounded-3xl border border-zinc-800">
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Review Profile Data */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Profile Details (Pre-filled)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-medium">College</label>
            <div className="w-full bg-black/40 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300 text-sm">
              {studentProfile.college || "N/A"}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-medium">Branch & Semester</label>
            <div className="w-full bg-black/40 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300 text-sm">
              {studentProfile.branch} • Sem {studentProfile.semester}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-medium">Phone Number</label>
            <div className="w-full bg-black/40 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300 text-sm">
              {studentProfile.phone || "N/A"}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-medium">LinkedIn</label>
            <div className="w-full bg-black/40 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300 text-sm truncate">
              {studentProfile.linkedIn || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* New Fields */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-2">Additional Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-medium">Emergency Contact Name *</label>
            <input 
              required
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              placeholder="E.g. Parent / Guardian"
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 text-zinc-100 text-sm outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-medium">Emergency Contact Phone *</label>
            <input 
              required
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 text-zinc-100 text-sm outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400 font-medium">Why do you want to join this visit? (Optional)</label>
          <textarea 
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="Tell us what you expect to learn..."
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 text-zinc-100 text-sm outline-none transition-all resize-none"
          />
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">Resume from Profile</p>
              <p className="text-xs text-zinc-500">resume.pdf</p>
            </div>
          </div>
          <button type="button" className="flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300">
            <Upload className="h-4 w-4" /> Update
          </button>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-4 border-t border-zinc-800">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>

    </form>
  );
}
