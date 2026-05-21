"use client"
import { useFetch } from "@/shared/hooks/useFetch"
import { usePagination } from "@/shared/hooks/usePagination"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Button } from "@/shared/ui/Button"
import { Pagination } from "@/shared/ui/Pagination"
import { EmptyState } from "@/shared/ui/EmptyState"
import { Icon } from "@/shared/ui/Icon"
import { Bell, CheckCheck } from "lucide-react"
import { relativeTime } from "@/shared/lib/utils"
import Link from "next/link"

export default function NotificationsPage() {
  const { page, goToPage } = usePagination()
  const { data, isLoading, refetch } = useFetch<any>(`/api/notifications?page=${page}`)

  const markAllRead = async () => {
    await fetch("/api/notifications/read-all", { method: "POST" })
    refetch()
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">通知</h1>
        <Button variant="ghost" size="sm" onClick={markAllRead}>
          <Icon icon={CheckCheck} size={16} />全部已读
        </Button>
      </div>
      {!data?.items?.length ? (
        <EmptyState icon={Bell} title="暂无通知" />
      ) : (
        <>
          <div className="space-y-2">
            {data.items.map((n: any) => (
              <Link key={n.id} href={n.link || "#"}>
                <GlassCard level={2} hover className={`p-4 flex items-start gap-3 ${!n.isRead ? "border-primary/20 bg-primary/[0.03]" : ""}`}>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{n.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{relativeTime(n.createdAt)}</p>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
        </>
      )}
    </div>
  )
}
