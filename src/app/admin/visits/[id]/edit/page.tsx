import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditVisitForm from "./edit-form";

export default async function EditVisitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const visit = await prisma.company_visits.findUnique({
    where: { id },
    include: {
      eligibilityRule: true,
    },
  });

  if (!visit) {
    notFound();
  }

  const companies = await prisma.companies.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, industry: true },
  });

  return <EditVisitForm visit={visit} companies={companies} />;
}
