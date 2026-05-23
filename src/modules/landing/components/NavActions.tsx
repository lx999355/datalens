"use client"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export function NavActions() {
  return (
    <div className="flex items-center gap-4">
      <MagneticButton onClick={() => { window.location.href = "/pricing" }} maxOffset={8}>
        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          定价
        </span>
      </MagneticButton>
      <MagneticButton onClick={() => { window.location.href = "/login" }} maxOffset={8}>
        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          登录
        </span>
      </MagneticButton>
      <MagneticButton onClick={() => { window.location.href = "/register" }} maxOffset={10}>
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
      <MagneticButton onClick={() => { window.location.href = "/pricing" }} maxOffset={8}>
        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          定价
        </span>
      </MagneticButton>
      <MagneticButton onClick={() => { window.location.href = "/dashboard" }} maxOffset={10}>
        <span className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-colors">
          进入控制台
        </span>
      </MagneticButton>
    </div>
  )
}
