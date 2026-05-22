"use client"
import { AdminSidebar } from "@/modules/admin/components/AdminSidebar"
import { AuthGuard } from "@/shared/ui/AuthGuard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  )
}
