import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LayoutDashboard, Building2, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/sign-in");
  }

  const userRole = (session.user as any).role;
  
  if (userRole !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 p-6 hidden md:flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-zinc-50 tracking-tight">VisitBridge Admin</h2>
        </div>
        
        <nav className="space-y-2 flex-1">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/companies">
            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800">
              <Building2 className="mr-2 h-4 w-4" />
              Companies
            </Button>
          </Link>
          <Link href="/admin/visits">
            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800">
              <MapPin className="mr-2 h-4 w-4" />
              Visits
            </Button>
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-800">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full justify-start text-zinc-300 border-zinc-700 hover:bg-zinc-800">
              <LogOut className="mr-2 h-4 w-4" />
              Exit Admin
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-lg font-bold text-zinc-50">Admin</h2>
          <div className="flex gap-2">
            <Link href="/admin/companies"><Button variant="ghost" size="sm">Companies</Button></Link>
            <Link href="/admin/visits"><Button variant="ghost" size="sm">Visits</Button></Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
