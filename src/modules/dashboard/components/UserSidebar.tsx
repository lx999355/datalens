"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/shared/hooks/useAuth"
import { cn } from "@/shared/lib/utils"
import { Icon } from "@/shared/ui/Icon"
import { Avatar } from "@/shared/ui/Avatar"
import { Logo } from "@/shared/ui/Logo"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  ShoppingCart,
  CreditCard,
  Settings,
  Bell,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { MagneticButton } from "@/shared/ui/MagneticButton"

const userNav = [
  { href: "/dashboard", label: "工作台", icon: LayoutDashboard },
  { href: "/dashboard/reports", label: "报告", icon: FileText },
  { href: "/dashboard/charts", label: "图表", icon: BarChart3 },
  { href: "/dashboard/orders", label: "订单", icon: ShoppingCart },
  { href: "/dashboard/subscription", label: "订阅", icon: CreditCard },
]

const bottomNav = [
  { href: "/dashboard/notifications", label: "通知", icon: Bell },
  { href: "/dashboard/settings", label: "设置", icon: Settings },
]

export function UserSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 backdrop-blur-[20px] bg-white/[0.02] border-r border-white/[0.06] p-4">
        <Logo linkTo="/dashboard" />

        <nav className="flex-1 space-y-1">
          {userNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-colors",
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
              )}
            >
              <Icon icon={item.icon} size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] pt-4 space-y-1">
          {bottomNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
              )}
            >
              <Icon icon={item.icon} size={18} />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-4 mt-4">
          <div className="flex items-center gap-3 px-3">
            <Avatar src={user?.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <div title="退出登录">
              <MagneticButton onClick={() => signOut({ callbackUrl: "/" })} maxOffset={4}>
                <span className="p-1.5 rounded-xl hover:bg-white/[0.05] transition-colors">
                  <Icon icon={LogOut} size={16} className="text-muted-foreground" />
                </span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-[20px] bg-white/[0.02] border-t border-white/[0.06]">
        <div className="flex items-center justify-around py-2">
          {userNav.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-colors",
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon icon={item.icon} size={20} />
              {item.label}
            </Link>
          ))}
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-colors",
              pathname.startsWith("/dashboard/settings")
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon icon={Settings} size={20} />
            设置
          </Link>
        </div>
      </nav>
    </>
  )
}