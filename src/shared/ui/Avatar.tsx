import { cn } from "@/shared/lib/utils"
import { User } from "lucide-react"
import { Icon } from "./Icon"

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeStyles = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
}

const iconSizes = { sm: 14, md: 18, lg: 24, xl: 32 } as const

export function Avatar({ src, alt = "", size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full overflow-hidden bg-white/[0.08] border border-white/[0.1] flex items-center justify-center flex-shrink-0",
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <Icon icon={User} size={iconSizes[size]} className="text-muted-foreground" />
      )}
    </div>
  )
}