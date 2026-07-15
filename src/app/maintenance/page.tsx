import Link from "next/link";
import { Wrench, ArrowLeft, Construction } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-[var(--card)]/50 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 sm:p-12 text-center shadow-2xl flex flex-col items-center">
          <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl rotate-12 blur-lg animate-pulse" />
            <div className="relative bg-gradient-to-br from-[var(--card)] to-[var(--surface)] border border-[var(--border)] rounded-2xl w-full h-full flex items-center justify-center shadow-xl">
              <Construction className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Maintenance</span>
          </h1>
          
          <p className="text-[var(--text-secondary)] mb-10 leading-relaxed">
            We're currently working hard behind the scenes to bring you a better experience. This page will be available soon!
          </p>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
