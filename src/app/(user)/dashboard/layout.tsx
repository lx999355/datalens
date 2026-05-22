import { UserSidebar } from "@/modules/dashboard/components/UserSidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
    </div>
  )
}