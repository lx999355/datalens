"use client"
import { UserSidebar } from "@/modules/dashboard/components/UserSidebar"
import { AuthGuard } from "@/shared/ui/AuthGuard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <UserSidebar />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      </div>
    </AuthGuard>
  )
}
