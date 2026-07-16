"use client";

import { AuthFormCard } from "@/components/auth/auth-form-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    try {
      // @ts-expect-error
      const { data: resData, error: authError } = await authClient.forgetPassword({
        email: data.email,
        redirectTo: "/reset-password",
      });

      if (authError) {
        setError(authError.message || "Failed to send reset email. Please try again.");
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  if (isSuccess) {
    return (
      <AuthFormCard
        title="Check your email"
        description="We've sent you a link to reset your password."
      >
        <div className="flex flex-col items-center justify-center gap-6 py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-8 w-8" />
          </motion.div>
          
          <Link href="/sign-in" className={buttonVariants({ variant: "outline", className: "w-full" })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard
      title="Reset password"
      description="Enter your email address and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          <AnimatePresence mode="wait">
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-red-500 font-medium"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-100 dark:border-red-900/50"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <div className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Remember your password?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </AuthFormCard>
  );
}
