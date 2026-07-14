import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Download, Calendar, MapPin, Building2, User } from "lucide-react";
import Confetti from "./confetti-client";
import { BookingQR } from "@/components/booking-qr";
import { ReceiptGenerator } from "@/components/receipt-generator";

export default async function PaymentSuccessPage({
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

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!studentProfile) redirect("/onboarding");

  const application = await prisma.visit_requests.findUnique({
    where: {
      studentId_visitId: {
        studentId: studentProfile.id,
        visitId: visit.id,
      },
    },
    include: {
      payments: {
        include: {
          transactions: true,
        },
      },
    },
  });

  if (!application || !application.payments || application.payments.status !== "PAID") {
    redirect(`/visits/${visit.slug || visit.id}/payment`);
  }

  const payment = application.payments;
  const transaction = payment.transactions[0];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
      <Confetti />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
        
        <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-10 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="mx-auto w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Your payment of ₹{payment.amount.toFixed(2)} was successful. You're all set for the industrial visit!
            </p>

            {/* Ticket Card */}
            <div className="bg-black border border-zinc-800 rounded-2xl p-6 mb-8 text-left max-w-xl mx-auto flex flex-col sm:flex-row gap-6">
              
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Company</p>
                  <p className="text-base font-medium text-white flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-zinc-400" /> {visit.companies.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Date & Location</p>
                  <p className="text-sm font-medium text-white flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-zinc-400" /> {visit.scheduledDate ? new Date(visit.scheduledDate).toLocaleDateString() : "TBA"}
                  </p>
                  <p className="text-sm font-medium text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-zinc-400" /> {visit.city || "TBA"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Attendee</p>
                  <p className="text-sm font-medium text-white flex items-center gap-2">
                    <User className="h-4 w-4 text-zinc-400" /> {session.user.name}
                  </p>
                </div>
              </div>

              <div className="sm:border-l sm:border-zinc-800 sm:pl-6 flex flex-col items-center justify-center shrink-0">
                <BookingQR value={application.id} />
                <p className="text-xs text-zinc-500 font-mono mt-3">ID: {application.id.slice(0, 8).toUpperCase()}</p>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ReceiptGenerator 
                applicationId={application.id}
                paymentId={payment.id}
                studentName={session.user.name || "Student"}
                visitTitle={visit.title}
                companyName={visit.companies.name}
                amount={payment.amount}
                date={new Date().toLocaleDateString()}
              />
              <Link href="/dashboard/applications" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2">
                  View My Applications <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
