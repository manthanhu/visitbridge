import { cn } from "@/lib/utils"
import type { VisitStatus } from "@/data/companies"

const statusConfig: Record<VisitStatus, { label: string; className: string }> = {
  OPEN: {
    label: "Open",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  FILLING_FAST: {
    label: "Filling Fast",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  ALMOST_FULL: {
    label: "Almost Full",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-white/5 text-[var(--text-muted)] border-white/10",
  },
}

interface StatusBadgeProps {
  status: VisitStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-tiny font-medium border",
        config.className,
        className
      )}
    >
      {status === "FILLING_FAST" && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
      )}
      {status === "ALMOST_FULL" && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
      )}
      {config.label}
    </span>
  )
}
