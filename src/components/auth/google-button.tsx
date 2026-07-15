"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false);

  const isConfigured =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "";

  const handleGoogleSignIn = async () => {
    if (!isConfigured) return;
    try {
      setIsLoading(true);
      await signIn.social({ 
        provider: "google",
        callbackURL: "/dashboard" 
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full relative h-11 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
      onClick={handleGoogleSignIn}
      disabled={isLoading || !isConfigured}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FcGoogle className="mr-2 h-5 w-5" />
      )}
      {!isConfigured ? "Google Sign-In will be available soon" : "Continue with Google"}
    </Button>
  );
}
