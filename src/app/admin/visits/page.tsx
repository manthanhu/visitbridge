import { getVisits } from "@/app/actions/visit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function AdminVisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;

  const result = await getVisits({ search, page, limit: 10 });
  const visits = result.visits || [];
  const totalPages = result.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Industrial Visits</h1>
          <p className="text-zinc-400 text-sm">Manage upcoming visits and placement drives</p>
        </div>
        <Link href="/admin/visits/new">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Visit
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
            placeholder="Search visits..."
            className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100"
          />
        </form>
      </div>

      <div className="rounded-md border border-zinc-800 bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400">Title</TableHead>
              <TableHead className="text-zinc-400">Company</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-zinc-400 text-center">Seats</TableHead>
              <TableHead className="text-zinc-400 text-center">Status</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.length === 0 ? (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                  No visits found
                </TableCell>
              </TableRow>
            ) : (
              visits.map((visit) => {
                const isFull = visit.availableSeats <= 0;
                
                return (
                  <TableRow key={visit.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <TableCell className="font-medium text-zinc-100">
                      <div>
                        {visit.title}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400 py-0 h-4">
                            {visit.visitType}
                          </Badge>
                          {visit.city && <span className="text-xs text-zinc-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{visit.city}</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      <Link href={`/admin/companies/${visit.companyId}`} className="hover:text-blue-400 transition-colors">
                        {visit.companies?.name || "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {visit.scheduledDate ? format(new Date(visit.scheduledDate), "MMM d, yyyy") : "TBD"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-zinc-300">
                        <Users className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{visit.totalSeats - visit.availableSeats}/{visit.totalSeats}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col gap-1 items-center">
                        {visit.published ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Published</Badge>
                        ) : (
                          <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">Draft</Badge>
                        )}
                        {isFull && <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-[10px] py-0 h-4">Full</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/visits/${visit.id}`}>
                          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                            View
                          </Button>
                        </Link>
                        <Link href={`/admin/visits/${visit.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {page > 1 && (
            <Link href={`/admin/visits?page=${page - 1}${search ? `&search=${search}` : ""}`}>
              <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900 text-zinc-300">Previous</Button>
            </Link>
          )}
          <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`/admin/visits?page=${page + 1}${search ? `&search=${search}` : ""}`}>
              <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900 text-zinc-300">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
