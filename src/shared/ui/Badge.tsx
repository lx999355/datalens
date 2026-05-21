import { cn } from "@/shared/lib/utils"

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "info"
  children: React.ReactNode
  className?: string
}

const badgeStyles = {
  default: "bg-white/[0.08] text-muted-foreground border-white/[0.1]",
  success: "bg-success/20 text-success border-success/30",
  warning: "bg-warning/20 text-warning border-warning/30",
  danger: "bg-danger/20 text-danger border-danger/30",
  info: "bg-info/20 text-info border-info/30",
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        badgeStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}