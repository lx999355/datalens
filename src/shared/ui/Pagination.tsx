import { cn } from "@/shared/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Icon } from "./Icon"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-xl hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Icon icon={ChevronLeft} size={18} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            "w-10 h-10 rounded-xl text-sm font-medium transition-all",
            p === page
              ? "bg-primary text-primary-foreground"
              : "hover:bg-white/[0.08] text-muted-foreground"
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-xl hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Icon icon={ChevronRight} size={18} />
      </button>
    </div>
  )
}