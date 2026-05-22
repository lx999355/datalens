"use client"
import { Logo } from "@/shared/ui/Logo"
import { useAuth } from "@/shared/hooks/useAuth"
import { NavActions, NavActionsAuthed } from "@/modules/landing/components/NavActions"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 backdrop-blur-[20px] bg-white/[0.02] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            {isAuthenticated ? <NavActionsAuthed /> : <NavActions />}
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  )
}
