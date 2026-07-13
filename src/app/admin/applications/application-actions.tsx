"use client";

import { useState } from "react";
import { approveApplication, rejectApplication } from "@/app/actions/admin-application";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function ApplicationActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  if (status === "APPROVED" || status === "REJECTED" || status === "CANCELLED") {
    return null;
  }

  const handleApprove = async () => {
    setLoading("approve");
    await approveApplication(id);
    setLoading(null);
    router.refresh();
  };

  const handleReject = async () => {
    setLoading("reject");
    await rejectApplication(id);
    setLoading(null);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={handleApprove}
        disabled={loading !== null}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
      >
        {loading === "approve" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">Approve</span>
      </button>
      <button
        onClick={handleReject}
        disabled={loading !== null}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        {loading === "reject" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">Reject</span>
      </button>
    </div>
  );
}
