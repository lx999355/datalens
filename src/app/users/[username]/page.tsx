"use client"
import { use } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Avatar } from "@/shared/ui/Avatar"
import { AnimatedCounter } from "@/shared/ui/AnimatedCounter"
import { Button } from "@/shared/ui/Button"
import { Icon } from "@/shared/ui/Icon"
import { ErrorState } from "@/shared/ui/ErrorState"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { FileText, BarChart3, Users, UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const { data: user, error, isLoading } = useFetch<any>(`/api/users/${username}`)

  if (isLoading) return <div className="p-6 lg:p-8"><ShimmerSkeleton variant="card" className="h-64" /></div>
  if (error) return <div className="p-6 lg:p-8"><ErrorState message="用户不存在" /></div>
  if (!user) return null

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Icon icon={ArrowLeft} size={16} />返回首页
        </Link>

        <GlassCard level={2} className="p-8">
          <div className="flex items-center gap-6">
            <Avatar src={user.avatar} size="xl" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{user.username}</h1>
              {user.bio && <p className="text-muted-foreground mt-1">{user.bio}</p>}
            </div>
            <MagneticButton
            onClick={async () => {
              await fetch(`/api/users/${user.id}/follow`, { method: "POST" })
            }}
            maxOffset={8}
          >
            <Button variant="secondary">
              <Icon icon={UserPlus} size={16} />{user.isFollowing ? "已关注" : "关注"}
            </Button>
          </MagneticButton>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <p className="text-2xl font-black text-foreground"><AnimatedCounter value={user.reportsCount} /></p>
              <p className="text-sm text-muted-foreground">报告</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-foreground"><AnimatedCounter value={user.chartsCount} /></p>
              <p className="text-sm text-muted-foreground">图表</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-foreground"><AnimatedCounter value={user.followersCount} /></p>
              <p className="text-sm text-muted-foreground">粉丝</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-foreground"><AnimatedCounter value={user.followingCount} /></p>
              <p className="text-sm text-muted-foreground">关注</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}