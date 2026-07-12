import { getCompanyById } from "@/app/actions/company";
import { notFound } from "next/navigation";
import EditCompanyForm from "./edit-form";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCompanyById(id);

  if (result.error || !result.company) {
    notFound();
  }

  return <EditCompanyForm company={result.company} />;
}
