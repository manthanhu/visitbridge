"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { onboardingSchema, type OnboardingInput } from "@/lib/validators/onboarding";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PersonalStep, EducationStep, AcademicStep, ProfessionalStep, PreferencesStep } from "@/app/onboarding/components";

const STEPS = [
  { id: "personal", title: "Personal" },
  { id: "education", title: "Education" },
  { id: "academic", title: "Academic" },
  { id: "professional", title: "Professional" },
  { id: "preferences", title: "Preferences" },
] as const;

export function EditProfileClient({ defaultValues }: { defaultValues: any }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema) as any,
    defaultValues,
    mode: "onTouched",
  });

  const { trigger, handleSubmit } = methods;

  const nextStep = async () => {
    const stepId = STEPS[currentStep].id;
    const isStepValid = await trigger(stepId as keyof OnboardingInput);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: OnboardingInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await updateProfile(data);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/profile");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = [
    PersonalStep,
    EducationStep,
    AcademicStep,
    ProfessionalStep,
    PreferencesStep,
  ][currentStep];

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mx-auto">
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-zinc-500 mb-2">
          {STEPS.map((step, idx) => (
            <span key={step.id} className={idx === currentStep ? "text-blue-600 dark:text-blue-400" : ""}>
              {step.title}
            </span>
          ))}
        </div>
        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentStepComponent />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 0 || isSubmitting}
            >
              Back
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSubmitting ? "Saving changes..." : "Save Changes"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
