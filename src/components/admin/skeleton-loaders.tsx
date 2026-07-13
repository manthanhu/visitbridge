import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg skeleton-shimmer", className)} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-[#12121a] p-5">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-24" />
      <div className="mt-4 flex items-end gap-[3px] h-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${30 + Math.random() * 60}%` }} />
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.03]">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded",
            i === 0 ? "w-32" : i === columns - 1 ? "w-16 ml-auto" : "w-20",
          )}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-[#12121a] overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-3 rounded", i === 0 ? "w-24" : "w-16")}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/[0.04] p-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { Skeleton };
