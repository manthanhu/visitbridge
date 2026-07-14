"use client";

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      // NOTE: Replace these with actual EmailJS credentials
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

      // If keys aren't configured yet, mock success for demonstration
      if (serviceId === "YOUR_SERVICE_ID") {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus("success");
        formRef.current.reset();
        setIsSubmitting(false);
        return;
      }

      await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      setStatus("success");
      formRef.current.reset();
    } catch (error: any) {
      console.error("EmailJS Error:", error);
      setStatus("error");
      setErrorMessage(error.text || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
      {status === "success" && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Message sent successfully!</p>
            <p className="text-xs opacity-80 mt-1">We'll get back to you as soon as possible.</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Something went wrong.</p>
            <p className="text-xs opacity-80 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name
          </label>
          <Input
            id="name"
            name="user_name"
            placeholder="John Doe"
            required
            className="bg-[var(--background)]/50 border-[var(--border)] focus-visible:ring-primary/50 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </label>
          <Input
            id="email"
            name="user_email"
            type="email"
            placeholder="john@example.com"
            required
            className="bg-[var(--background)]/50 border-[var(--border)] focus-visible:ring-primary/50 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium text-foreground">
          Subject
        </label>
        <Input
          id="subject"
          name="subject"
          placeholder="How can we help you?"
          required
          className="bg-[var(--background)]/50 border-[var(--border)] focus-visible:ring-primary/50 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Write your message here..."
          required
          className="w-full bg-[var(--background)]/50 border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl p-3 text-sm text-foreground placeholder:text-[var(--text-muted)] resize-none transition-shadow"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-base font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
