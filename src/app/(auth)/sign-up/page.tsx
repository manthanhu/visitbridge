"use client";

import { AuthFormCard } from "@/components/auth/auth-form-card";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema, type SignUpInput } from "@/lib/validators/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      college: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student" as const,
    },
  });

  const password = watch("password");
  const currentRole = watch("role");

  const onSubmit = async (data: SignUpInput) => {
    setError(null);
    try {
      const { data: authData, error: authError } = await signUp.email({
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
        // @ts-ignore - Assuming better auth takes custom fields if passed
        role: data.role,
        college: data.college,
      });

      if (authError) {
        setError(authError.message || "Could not create account. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <AuthFormCard
      title="Create an account"
      description="Join VisitBridge and start connecting."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        {/* Role Selector */}
        <div className="flex flex-col gap-2">
          <Label>I am a</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("role", "student")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all",
                currentRole === "student"
                  ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-400 ring-1 ring-blue-600"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400"
              )}
            >
              <GraduationCap className="h-4 w-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "company")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all",
                currentRole === "company"
                  ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-400 ring-1 ring-blue-600"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400"
              )}
            >
              <Building2 className="h-4 w-4" />
              Company
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="college">College / University</Label>
            <Input
              id="college"
              placeholder="Your institution"
              {...register("college")}
              className={errors.college ? "border-red-500" : ""}
            />
            {errors.college && (
              <p className="text-xs text-red-500">{errors.college.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          <PasswordStrength password={password} />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="relative flex items-center py-2">
        <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
        <span className="mx-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Or continue with
        </span>
        <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
      </div>

      <GoogleButton />

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthFormCard>
  );
}
