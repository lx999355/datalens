"use client"
import { use } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Avatar } from "@/shared/ui/Avatar"
import { Badge } from "@/shared/ui/Badge"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { ErrorState } from "@/shared/ui/ErrorState"
import { formatDateTime } from "@/shared/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Icon } from "@/shared/ui/Icon"

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: users, error, isLoading } = useFetch<any>(`/api/admin/users?search=`)
  // We need a direct user fetch - but admin users list doesn't have individual endpoint
  // So we'll use the list and filter
  const user = users?.items?.find((u: any) => u.id === id)

  if (isLoading) return <div className="p-6 lg:p-8"><ShimmerSkeleton variant="card" className="h-48" /></div>
  if (!user) return <div className="p-6 lg:p-8"><ErrorState message="用户不存在" /></div>

  const roleLabels: Record<string, { label: string; variant: "info" | "warning" | "default" }> = {
    super_admin: { label: "超管", variant: "warning" },
    sub_admin: { label: "管理员", variant: "info" },
    user: { label: "用户", variant: "default" },
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <Icon icon={ArrowLeft} size={16} />返回
      </Link>
      <GlassCard level={2} className="p-8">
        <div className="flex items-center gap-6 mb-6">
          <Avatar src={user.avatar} size="xl" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user.username}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between"><span className="text-muted-foreground">角色</span><Badge variant={roleLabels[user.role]?.variant}>{roleLabels[user.role]?.label}</Badge></div>
          <div className="flex justify-between"><span className="text-muted-foreground">状态</span><Badge variant={user.isActive ? "success" : "danger"}>{user.isActive ? "正常" : "禁用"}</Badge></div>
          <div className="flex justify-between"><span className="text-muted-foreground">注册时间</span><span className="text-foreground">{formatDateTime(user.createdAt)}</span></div>
        </div>
      </GlassCard>
    </div>
  )
}