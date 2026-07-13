import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";

type DataTableProps = {
  children: React.ReactNode;
  searchValue?: string;
  searchPlaceholder?: string;
  searchName?: string;
  headerContent?: React.ReactNode;
  footer?: React.ReactNode;
};

export function DataTable({
  children,
  searchValue,
  searchPlaceholder = "Search…",
  searchName = "search",
  headerContent,
  footer,
}: DataTableProps) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-[#12121a] overflow-hidden">
      {/* Toolbar */}
      {(searchValue !== undefined || headerContent) && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/[0.04] bg-white/[0.01]">
          {searchValue !== undefined && (
            <form className="flex-1 min-w-[200px] max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
              <input
                type="search"
                name={searchName}
                defaultValue={searchValue}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-white/[0.04] bg-white/[0.02] pl-9 pr-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/30 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
              />
            </form>
          )}
          {headerContent}
        </div>
      )}

      {/* Table content */}
      <div className="overflow-x-auto">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04] bg-white/[0.01]">
          {footer}
        </div>
      )}
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  baseUrl,
  searchParams,
}: {
  page: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  const buildUrl = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <>
      <span className="text-xs text-zinc-600">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        {page > 1 && (
          <Link
            href={buildUrl(page - 1)}
            className="inline-flex items-center rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
          >
            Previous
          </Link>
        )}
        {page < totalPages && (
          <Link
            href={buildUrl(page + 1)}
            className="inline-flex items-center rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors"
          >
            Next
          </Link>
        )}
      </div>
    </>
  );
}
