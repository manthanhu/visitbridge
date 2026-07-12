"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { togglePublish } from "@/app/actions/visit";
import { Globe, Globe2, Loader2 } from "lucide-react";

export default function PublishToggle({ id, initialPublished }: { id: string, initialPublished: boolean }) {
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const result = await togglePublish(id);
    if (result.success && result.published !== undefined) {
      setIsPublished(result.published);
    }
    setIsLoading(false);
  };

  return (
    <Button 
      onClick={handleToggle} 
      disabled={isLoading}
      variant={isPublished ? "outline" : "default"}
      className={isPublished 
        ? "border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400" 
        : "bg-emerald-600 hover:bg-emerald-700 text-white"
      }
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isPublished ? (
        <Globe2 className="mr-2 h-4 w-4" />
      ) : (
        <Globe className="mr-2 h-4 w-4" />
      )}
      {isPublished ? "Unpublish Visit" : "Publish Visit"}
    </Button>
  );
}
