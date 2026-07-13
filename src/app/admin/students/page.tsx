import { getStudents } from "@/app/actions/admin-students";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable, Pagination } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";
import { format } from "date-fns";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;

  const result = await getStudents({ search, page, limit: 15 });
  const students = result.students || [];
  const totalPages = result.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="View all registered students and their profiles"
      />

      <DataTable
        searchValue={search}
        searchPlaceholder="Search by name, email, college, or branch…"
        footer={
          <Pagination
            page={page}
            totalPages={totalPages}
            baseUrl="/admin/students"
            searchParams={search ? { search } : {}}
          />
        }
      >
        {students.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No students registered yet"
            description="Students will appear here after they complete onboarding."
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] text-left">
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">College</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Branch</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Semester</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden lg:table-cell">CGPA</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Applications</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hidden xl:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {students.map((student: any) => (
                <tr
                  key={student.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/15 to-blue-500/15 text-xs font-bold text-emerald-300 ring-1 ring-white/[0.06]">
                        {student.user.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-200 truncate">{student.user.name}</p>
                        <p className="text-[11px] text-zinc-600 truncate">{student.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-zinc-400 truncate block max-w-[180px]">
                      {student.colleges?.name || student.college || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-zinc-400">{student.branch || "N/A"}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-zinc-400 tabular-nums">
                      {student.semester ? `Sem ${student.semester}` : "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs font-medium text-zinc-300 tabular-nums">
                      {student.currentCgpa?.toFixed(1) || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                      {student._count.visit_requests}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-xs text-zinc-600 tabular-nums">
                      {format(new Date(student.createdAt), "MMM d, yyyy")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataTable>
    </div>
  );
}
