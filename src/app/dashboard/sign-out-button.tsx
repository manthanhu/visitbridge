"use client";

import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          router.refresh();
        },
      },
    });
  };

  return (
    <Button variant="outline" onClick={handleSignOut} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}
