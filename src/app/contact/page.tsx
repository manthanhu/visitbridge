import { ContactForm } from "@/components/contact-form";
import { Mail, MapPin, Phone, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden pt-20">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Get in <span className="text-gradient-blue">Touch</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Have questions about upcoming visits, partnership opportunities, or need support? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Form */}
          <div>
            <div className="bg-[var(--card)]/50 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Email</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Our friendly team is here to help.</p>
                    <a href="mailto:hello@visitbridge.com" className="text-sm font-medium text-primary hover:underline">hello@visitbridge.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Office</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Come say hello at our HQ.</p>
                    <p className="text-sm font-medium text-foreground">100 Tech Park, Block B<br />Bangalore, Karnataka 560100</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <Phone className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Phone</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Mon-Fri from 9am to 6pm.</p>
                    <a href="tel:+919876543210" className="text-sm font-medium text-foreground hover:text-primary transition-colors">+91 98765 43210</a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="bg-white/[0.02] border border-[var(--border)] rounded-2xl p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" /> How do I apply for a visit?
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Create an account, complete your profile, and browse available visits. If you meet the eligibility criteria, you can click "Apply" on the visit page.
                  </p>
                </div>
                <div className="bg-white/[0.02] border border-[var(--border)] rounded-2xl p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" /> Is there a fee for industrial visits?
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Some visits are completely free, while others may have a nominal fee to cover transportation and logistics. The fee is clearly mentioned on each visit page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
