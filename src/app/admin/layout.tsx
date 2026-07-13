import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";

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
    <AdminShell
      userName={session.user.name}
      userImage={session.user.image}
    >
      {children}
    </AdminShell>
  );
}
