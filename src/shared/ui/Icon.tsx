import { cn } from "@/shared/lib/utils"
import { LucideIcon } from "lucide-react"

interface IconProps {
  icon: LucideIcon
  size?: number
  className?: string
}

export function Icon({ icon: LucideIcon, size = 20, className }: IconProps) {
  return <LucideIcon size={size} className={cn("flex-shrink-0", className)} />
}