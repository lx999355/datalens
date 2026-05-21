"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/shared/hooks/useAuth"
import { cn } from "@/shared/lib/utils"
import { Icon } from "@/shared/ui/Icon"
import { Logo } from "@/shared/ui/Logo"
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  ShoppingCart,
  CreditCard,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { MagneticButton } from "@/shared/ui/MagneticButton"

const adminNav = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/users", label: "用户管理", icon: Users },
  { href: "/admin/reports", label: "报告管理", icon: FileText },
  { href: "/admin/charts", label: "图表管理", icon: BarChart3 },
  { href: "/admin/orders", label: "订单管理", icon: ShoppingCart },
  { href: "/admin/subscriptions", label: "订阅管理", icon: CreditCard },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, isSuperAdmin } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 backdrop-blur-[20px] bg-white/[0.02] border-r border-white/[0.06] p-4">
      <div className="flex items-center gap-2 px-3 mb-8">
        <Logo linkTo="/admin" />
        <span className="text-xs text-muted-foreground font-medium ml-1 mt-0.5">管理后台</span>
      </div>

      <nav className="flex-1 space-y-1">
        {adminNav.map((item) => {
          // Hide settings from non-super-admin
          if (item.href === "/admin/settings" && !isSuperAdmin) return null
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-colors",
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
              )}
            >
              <Icon icon={item.icon} size={18} />
              {item.label}
            </Link>
          )
        })}
        {isSuperAdmin && (
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-colors",
              pathname.startsWith("/admin/settings")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
            )}
          >
            <Icon icon={Settings} size={18} />
            系统设置
          </Link>
        )}
      </nav>

      <div className="border-t border-white/[0.06] pt-4 space-y-2">
        <MagneticButton href="/dashboard" maxOffset={4}>
          <span className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors">
            <Icon icon={ArrowLeft} size={18} />
            返回用户端
          </span>
        </MagneticButton>
        <MagneticButton onClick={() => signOut({ callbackUrl: "/" })} maxOffset={4}>
          <span className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors w-full">
            <Icon icon={LogOut} size={18} />
            退出登录
          </span>
        </MagneticButton>
      </div>
    </aside>
  )
}