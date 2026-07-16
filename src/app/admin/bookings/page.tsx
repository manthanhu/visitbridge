import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Search, IndianRupee, MapPin, Building2, User, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminBookingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user || (session.user as unknown as { role?: string }).role !== "ADMIN") {
    redirect("/sign-in");
  }

  const applications = await prisma.visit_requests.findMany({
    include: {
      students: { include: { user: true } },
      company_visits: { include: { companies: true } },
      payments: true,
    },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
      <nav className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Bookings & Applications</h1>
            <p className="text-zinc-400">Manage all student applications and payments.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-medium">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Visit</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {applications.map((app: typeof applications[0]) => (
                  <tr key={app.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                          {app.students.user.name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-200">{app.students.user.name}</p>
                          <p className="text-xs text-zinc-500">{app.students.college}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-200">{app.company_visits.title}</p>
                      <p className="text-xs text-zinc-500">{app.company_visits.companies.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        app.status === "APPROVED" ? "border-emerald-500/30 text-emerald-400" :
                        app.status === "REJECTED" ? "border-red-500/30 text-red-400" :
                        app.status === "CANCELLED" ? "border-zinc-500/30 text-zinc-400" :
                        "border-amber-500/30 text-amber-400"
                      }>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {app.payments ? (
                        <div className="flex flex-col">
                          <span className={
                            app.payments.status === "PAID" ? "text-emerald-400 font-medium" : 
                            app.payments.status === "FAILED" ? "text-red-400" : "text-amber-400"
                          }>
                            {app.payments.status}
                          </span>
                          <span className="text-xs text-zinc-500">₹{app.payments.amount}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 italic">No Payment</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {format(new Date(app.appliedAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
