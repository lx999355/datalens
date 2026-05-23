"use client"
import { use, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Badge } from "@/shared/ui/Badge"
import { Button } from "@/shared/ui/Button"
import { Icon } from "@/shared/ui/Icon"
import { Avatar } from "@/shared/ui/Avatar"
import { ShimmerSkeleton } from "@/shared/ui/ShimmerSkeleton"
import { useToast } from "@/shared/ui/Toast"
import { Eye, Download, Heart, MessageSquare, ArrowLeft, ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react"
import Link from "next/link"
import { formatDateTime } from "@/shared/lib/utils"

export default function ChartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const { data: chart, isLoading } = useFetch<any>(`/api/charts/${id}`)
  const { addToast } = useToast()
  const [current, setCurrent] = useState(0)
  const [localLikeCount, setLocalLikeCount] = useState<number | null>(null)
  const [localLiked, setLocalLiked] = useState<boolean | null>(null)
  const [localDownloadCount, setLocalDownloadCount] = useState<number | null>(null)
  const [liking, setLiking] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showComments, setShowComments] = useState(searchParams.get("comment") === "1")
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (chart) {
      if (localLikeCount === null) setLocalLikeCount(chart.likeCount)
      if (localLiked === null) setLocalLiked(chart.hasLiked)
      if (localDownloadCount === null) setLocalDownloadCount(chart.downloadCount)
    }
  }, [chart])

  useEffect(() => {
    if (showComments) {
      fetch(`/api/charts/${id}/comments`).then(r => r.json()).then(j => {
        setComments(j.data?.items || [])
      }).catch(() => {})
    }
  }, [showComments, id])

  const handleLike = async () => {
    setLiking(true)
    try {
      const res = await fetch(`/api/charts/${id}/like`, { method: "POST" })
      const json = await res.json()
      if (json.data) {
        setLocalLiked(json.data.liked)
        setLocalLikeCount((c: number | null) => (c ?? 0) + (json.data.liked ? 1 : -1))
      }
    } catch { addToast("error", "操作失败") }
    finally { setLiking(false) }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await fetch(`/api/charts/${id}/download`, { method: "POST" })
      setLocalDownloadCount((c: number | null) => (c ?? 0) + 1)
      const img = allImages[current]
      const a = document.createElement("a"); a.href = img; a.download = chart?.title || "chart"; a.click()
    } catch { addToast("error", "下载失败") }
    finally { setDownloading(false) }
  }

  const handleSendComment = async () => {
    if (!commentText.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/charts/${id}/comments`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      })
      const json = await res.json()
      if (json.data) {
        setComments((prev: any[]) => [json.data, ...prev])
        setCommentText("")
      }
    } catch { addToast("error", "发送失败") }
    finally { setSending(false) }
  }

  if (isLoading || !chart) return <div className="p-6 lg:p-8"><ShimmerSkeleton variant="card" className="h-96" /></div>

  const allImages: string[] = [chart.fileUrl]
  if (chart.images && Array.isArray(chart.images)) allImages.push(...chart.images)
  const hasMultiple = allImages.length > 1

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Icon icon={ArrowLeft} size={16} />返回首页
        </Link>

        <GlassCard level={2} className="p-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">{chart.title}</h1>
            <Badge>{chart.type === "generated" ? "生成" : "图片"}</Badge>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Avatar src={chart.user?.avatar} size="sm" />
            <div>
              <p className="text-foreground font-medium">{chart.user?.username}</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(chart.createdAt)}</p>
            </div>
          </div>

          {chart.description && <p className="text-muted-foreground mb-6">{chart.description}</p>}

          <div className="bg-white/[0.03] rounded-2xl p-6 mb-6 min-h-[300px] flex items-center justify-center relative">
            <img src={allImages[current]} alt={`${chart.title} (${current + 1}/${allImages.length})`} className="max-w-full max-h-[500px] object-contain rounded-xl" />
            {hasMultiple && (<>
              <button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70" onClick={() => setCurrent(p => (p - 1 + allImages.length) % allImages.length)}><Icon icon={ChevronLeft} size={20} /></button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70" onClick={() => setCurrent(p => (p + 1) % allImages.length)}><Icon icon={ChevronRight} size={20} /></button>
            </>)}
          </div>

          {hasMultiple && (<>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {allImages.map((url: string, i: number) => (
                <button key={i} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 ${i === current ? "border-primary" : "border-transparent"}`} onClick={() => setCurrent(i)}>
                  <img src={url} alt={`${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mb-6">{current + 1} / {allImages.length}</p>
          </>)}

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Icon icon={Eye} size={16} />{chart.viewCount}</span>
            <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-1 hover:text-foreground transition-colors disabled:opacity-50">
              <Icon icon={downloading ? Loader2 : Download} size={16} className={downloading ? "animate-spin" : ""} />
              {localDownloadCount ?? chart.downloadCount}
            </button>
            <button onClick={handleLike} disabled={liking} className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${(localLiked ?? chart.hasLiked) ? "text-red-500" : "hover:text-foreground"}`}>
              <Icon icon={liking ? Loader2 : Heart} size={16} className={liking ? "animate-spin" : ""} />
              {localLikeCount ?? chart.likeCount}
            </button>
            <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-1 transition-colors ${showComments ? "text-primary" : "hover:text-foreground"}`}>
              <Icon icon={MessageSquare} size={16} />{comments.length || chart.commentCount}
            </button>
          </div>
        </GlassCard>

        {/* 评论区 */}
        {showComments && (
          <GlassCard level={2} className="p-6">
            <h3 className="font-semibold text-foreground mb-4">评论 ({comments.length || chart.commentCount})</h3>
            <div className="flex gap-2 mb-6">
              <input
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/30"
                placeholder="写下你的评论..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendComment()}
              />
              <Button onClick={handleSendComment} disabled={sending || !commentText.trim()}>
                <Icon icon={sending ? Loader2 : Send} size={16} className={sending ? "animate-spin" : ""} />
              </Button>
            </div>
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">暂无评论</p>
            ) : (
              <div className="space-y-4">
                {comments.map((c: any) => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar src={c.user?.avatar} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{c.user?.username}</span>
                        <span className="text-xs text-muted-foreground">{formatDateTime(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  )
}
