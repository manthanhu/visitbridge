import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import PaymentCheckoutClient from "./payment-checkout-client";

export default async function PaymentPage({
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
      published: true,
      deletedAt: null,
    },
    include: {
      companies: true,
    },
  });

  if (!visit) {
    notFound();
  }

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!studentProfile) {
    redirect("/onboarding");
  }

  // Check application status
  const application = await prisma.visit_requests.findUnique({
    where: {
      studentId_visitId: {
        studentId: studentProfile.id,
        visitId: visit.id,
      },
    },
    include: {
      payments: true,
    },
  });

  if (!application) {
    redirect(`/visits/${visit.slug || visit.id}`);
  }

  if (application.status !== "APPROVED") {
    redirect(`/dashboard/applications`);
  }

  if (application.payments && application.payments.status === "PAID") {
    redirect(`/visits/${visit.slug || visit.id}/payment/success`);
  }

  const visitFee = visit.fee;
  const platformFee = visitFee * 0.05; // 5% platform fee
  const tax = (visitFee + platformFee) * 0.18; // 18% GST
  const totalAmount = visitFee + platformFee + tax;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
      <nav className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4 sm:px-6 lg:px-8">
          <Link href={`/dashboard/applications`} className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Applications
          </Link>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">Complete Your Payment</h1>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Secure your spot for the {visit.companies.name} visit by completing the payment below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Order Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="flex gap-4 items-center mb-6 pb-6 border-b border-zinc-800">
              <div className="h-16 w-16 rounded-xl bg-black border border-zinc-700 flex items-center justify-center p-2 shrink-0">
                {visit.companies.logoUrl ? (
                  <img src={visit.companies.logoUrl} alt={visit.companies.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="text-xs text-zinc-500">Logo</div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">{visit.title}</h3>
                <p className="text-sm text-zinc-400">{visit.companies.name}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-zinc-800 text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>Visit Fee</span>
                <span>₹{visitFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Platform Fee (5%)</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Taxes (18% GST)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white">Total Amount</span>
              <span className="text-2xl font-bold text-white">₹{totalAmount.toFixed(2)}</span>
            </div>

            <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3 items-start">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-400/90 leading-relaxed">
                Payments are securely processed by Razorpay. Your spot is confirmed instantly upon successful payment.
              </p>
            </div>
          </div>

          {/* Checkout Client */}
          <div className="bg-black border border-zinc-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2">Payment Details</h2>
            <p className="text-sm text-zinc-400 mb-8">You will be securely redirected to Razorpay.</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 className="h-5 w-5 text-blue-500" /> Supports UPI, Cards, Netbanking
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 className="h-5 w-5 text-blue-500" /> Instant Confirmation
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 className="h-5 w-5 text-blue-500" /> 100% Secure Transaction
              </div>
            </div>

            <PaymentCheckoutClient 
              visitId={visit.id} 
              user={{
                name: session.user.name || "Student",
                email: session.user.email || "",
                contact: studentProfile.phone || "",
              }} 
            />
          </div>

        </div>
      </main>
    </div>
  );
}
