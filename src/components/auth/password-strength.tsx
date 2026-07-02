"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  const criteriaMet = [
    hasMinLength,
    hasUpperCase && hasLowerCase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  const getStrengthColor = () => {
    if (password.length === 0) return "bg-zinc-200 dark:bg-zinc-800";
    if (criteriaMet === 1) return "bg-red-500";
    if (criteriaMet === 2) return "bg-orange-500";
    if (criteriaMet === 3) return "bg-yellow-500";
    if (criteriaMet === 4) return "bg-emerald-500";
    return "bg-zinc-200 dark:bg-zinc-800";
  };

  const getStrengthText = () => {
    if (password.length === 0) return "";
    if (criteriaMet === 1) return "Weak";
    if (criteriaMet === 2) return "Fair";
    if (criteriaMet === 3) return "Good";
    if (criteriaMet === 4) return "Strong";
    return "";
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              password.length > 0 && index <= criteriaMet
                ? getStrengthColor()
                : "bg-zinc-200 dark:bg-zinc-800"
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-[10px] sm:text-xs">
        <span
          className={cn(
            "transition-colors duration-300 font-medium",
            password.length === 0 ? "text-transparent" : "text-zinc-500"
          )}
        >
          {getStrengthText()}
        </span>
      </div>
    </div>
  );
}
