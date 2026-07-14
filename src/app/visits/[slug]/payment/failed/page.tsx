import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default async function PaymentFailedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/sign-in");
  }

  const visit = await prisma.company_visits.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      companies: true,
    },
  });

  if (!visit) notFound();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-12 flex items-center justify-center">
        
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="mx-auto w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Payment Failed</h1>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              We couldn't process your payment for the {visit.companies.name} visit. Your account has not been charged.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/visits/${visit.slug || visit.id}/payment`} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4" /> Try Again
                </button>
              </Link>
              <Link href="/dashboard/applications" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
