"use client"

import { useRouter } from "next/navigation"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export function NavActions() {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4">
      <MagneticButton href="/pricing" maxOffset={8}>
        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          定价
        </span>
      </MagneticButton>
      <MagneticButton href="/login" maxOffset={8}>
        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          登录
        </span>
      </MagneticButton>
      <MagneticButton href="/register" maxOffset={10}>
        <span className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-colors">
          注册
        </span>
      </MagneticButton>
    </div>
  )
}

export function NavActionsAuthed() {
  return (
    <div className="flex items-center gap-4">
      <MagneticButton href="/pricing" maxOffset={8}>
        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          定价
        </span>
      </MagneticButton>
      <MagneticButton href="/dashboard" maxOffset={10}>
        <span className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-colors">
          进入控制台
        </span>
      </MagneticButton>
    </div>
  )
}