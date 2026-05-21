import { cn } from "@/shared/lib/utils"

interface SkeletonProps {
  className?: string
}

export function SkeletonText({ className }: SkeletonProps) {
  return (
    <div className={cn("h-4 w-full bg-white/[0.05] rounded-2xl overflow-hidden relative", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-shimmer" />
    </div>
  )
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("h-48 w-full bg-white/[0.05] rounded-2xl overflow-hidden relative", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-shimmer" />
    </div>
  )
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return (
    <div className={cn("w-12 h-12 rounded-full bg-white/[0.05] overflow-hidden relative flex-shrink-0", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-shimmer" />
    </div>
  )
}

export function ShimmerSkeleton({ variant = "card", className }: SkeletonProps & { variant?: "text" | "card" | "avatar" }) {
  if (variant === "text") return <SkeletonText className={className} />
  if (variant === "avatar") return <SkeletonAvatar className={className} />
  return <SkeletonCard className={className} />
}