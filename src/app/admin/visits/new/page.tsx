import { prisma } from "@/lib/prisma";
import VisitForm from "./visit-form";

export default async function NewVisitPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialCompanyId = typeof params.companyId === "string" ? params.companyId : undefined;

  const companies = await prisma.companies.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, industry: true },
  });

  return <VisitForm companies={companies} initialCompanyId={initialCompanyId} />;
}
