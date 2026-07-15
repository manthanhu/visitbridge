"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "./actions";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="relative z-10 w-full max-w-md bg-[var(--card)]/50 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-[var(--text-secondary)] text-sm text-center mt-2">
            Restricted area. Please enter your credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="admin@example.com"
              className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-black/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              placeholder="••••••••"
              className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-black/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}
