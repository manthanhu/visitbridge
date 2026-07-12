"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { applyToVisit } from "@/app/actions/application";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ApplyButton({ visitId, isEligible }: { visitId: string; isEligible: boolean }) {
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    setError(null);
    
    const result = await applyToVisit(visitId);
    
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    
    setIsApplying(false);
  };

  if (success) {
    return (
      <div className="w-full">
        <Button disabled className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Application Submitted
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <Button 
        onClick={handleApply} 
        disabled={!isEligible || isApplying}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        {isApplying ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</>
        ) : (
          <>Apply Now <ArrowRight className="ml-2 h-4 w-4" /></>
        )}
      </Button>
      
      {error && (
        <p className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 p-2 rounded">
          {error}
        </p>
      )}
      
      {!isEligible && !error && (
        <p className="text-xs text-zinc-500 text-center">
          You don't meet the eligibility criteria for this visit.
        </p>
      )}
    </div>
  );
}
