"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOut } from "@/lib/auth-client";

export default function SettingsPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await deleteAccount();
      if (res.error) {
        setError(res.error);
        setIsDeleting(false);
        setShowConfirm(false);
      } else {
        // Sign out on the client to clear cookies/session
        await signOut();
        router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pt-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/profile" className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-zinc-500">Manage your account preferences and data.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900/50 p-6 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <h2 className="text-xl font-bold text-red-600 dark:text-red-500 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Danger Zone
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-xl">
            Once you delete your account, there is no going back. Please be certain.
            This action will permanently delete all your data, profile, and history from our servers.
          </p>

          {!showConfirm ? (
            <Button 
              variant="destructive" 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={() => setShowConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 dark:bg-red-950/30 p-4 rounded-xl border border-red-100 dark:border-red-900/50"
            >
              <p className="text-red-800 dark:text-red-400 font-medium mb-4">
                Are you absolutely sure? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes, delete my account"}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
