import { getCompanies } from "@/app/actions/company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;

  const result = await getCompanies({ search, page, limit: 10 });
  const companies = result.companies || [];
  const totalPages = result.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Companies</h1>
          <p className="text-zinc-400 text-sm">Manage participating companies</p>
        </div>
        <Link href="/admin/companies/new">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <form className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search companies..."
            className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100"
          />
        </form>
      </div>

      <div className="rounded-md border border-zinc-800 bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Industry</TableHead>
              <TableHead className="text-zinc-400">Location</TableHead>
              <TableHead className="text-zinc-400 text-center">Visits</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  <TableCell className="font-medium text-zinc-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                        {company.logoUrl ? (
                          <img src={company.logoUrl} alt="" className="w-6 h-6 object-contain" />
                        ) : (
                          <Building2 className="h-4 w-4 text-zinc-500" />
                        )}
                      </div>
                      {company.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {company.industry ? <Badge variant="outline" className="border-zinc-700 text-zinc-300">{company.industry}</Badge> : "-"}
                  </TableCell>
                  <TableCell className="text-zinc-300">{company.headquarters || company.location || "-"}</TableCell>
                  <TableCell className="text-center text-zinc-300">
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {company._count.company_visits}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/companies/${company.id}`}>
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/companies/${company.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {page > 1 && (
            <Link href={`/admin/companies?page=${page - 1}${search ? `&search=${search}` : ""}`}>
              <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900 text-zinc-300">Previous</Button>
            </Link>
          )}
          <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`/admin/companies?page=${page + 1}${search ? `&search=${search}` : ""}`}>
              <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900 text-zinc-300">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
