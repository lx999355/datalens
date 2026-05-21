import { cn } from "@/shared/lib/utils"
import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
}

const variantStyles = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(96,165,250,0.3)]",
  secondary: "bg-white/[0.05] border border-white/[0.1] text-foreground hover:bg-white/[0.1]",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]",
  danger: "bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30",
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded-xl",
  md: "px-5 py-2.5 rounded-2xl",
  lg: "px-8 py-3.5 text-lg rounded-2xl",
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}