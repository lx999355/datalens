"use client"
import { use, useState } from "react"
import { useFetch } from "@/shared/hooks/useFetch"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Button } from "@/shared/ui/Button"
import { Input } from "@/shared/ui/Input"
import { Textarea } from "@/shared/ui/Textarea"
import { Badge } from "@/shared/ui/Badge"
import { Icon } from "@/shared/ui/Icon"
import { useToast } from "@/shared/ui/Toast"
import { ArrowLeft, CheckCircle, XCircle, Upload } from "lucide-react"
import Link from "next/link"
import { formatDateTime } from "@/shared/lib/utils"
import { useRef } from "react"

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { addToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [adminNote, setAdminNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: order, refetch } = useFetch<any>(`/api/admin/orders/${id}`)

  const updateStatus = async (status: string) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("status", status)
      if (adminNote) formData.append("adminNote", adminNote)
      const deliverFile = fileRef.current?.files?.[0]
      if (deliverFile) formData.append("deliverFile", deliverFile)

      const res = await fetch(`/api/admin/orders/${id}`, { method: "PUT", body: formData })
      if (res.ok) { addToast("success", "状态已更新"); refetch() }
      else addToast("error", "操作失败")
    } catch { addToast("error", "操作失败") }
    finally { setIsSubmitting(false) }
  }

  if (!order) return null

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <Icon icon={ArrowLeft} size={16} />返回
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">订单 #{id.slice(-8)}</h1>
        <Badge variant={order.status === "completed" ? "success" : "info"}>{order.status}</Badge>
      </div>
      <GlassCard level={2} className="p-6 space-y-3">
        <div className="flex justify-between"><span className="text-muted-foreground">用户</span><span className="text-foreground">{order.user?.username} ({order.user?.email})</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">类型</span><span className="text-foreground">{order.type}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">金额</span><span className="text-foreground font-semibold">¥{order.amount}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">创建时间</span><span className="text-foreground">{formatDateTime(order.createdAt)}</span></div>
        {order.requirement && <div><span className="text-muted-foreground">需求</span><p className="text-foreground mt-1 text-sm">{typeof order.requirement === "string" ? order.requirement : JSON.stringify(order.requirement)}</p></div>}
        {order.deliverUrl && <div><span className="text-muted-foreground">交付文件</span><a href={order.deliverUrl} className="text-primary hover:underline text-sm block mt-1">下载</a></div>}
      </GlassCard>

      <GlassCard level={2} className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">处理操作</h2>
        <Textarea label="管理员备注" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={2} placeholder="填写备注（拒绝时需填写原因）" />
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">交付文件</label>
          <input ref={fileRef} type="file" className="text-sm text-muted-foreground" />
        </div>
        <div className="flex flex-wrap gap-3">
          {order.status === "pending_payment" && (
            <>
              <Button onClick={() => updateStatus("confirmed")} disabled={isSubmitting}><Icon icon={CheckCircle} size={16} />确认收款</Button>
              <Button variant="danger" onClick={() => updateStatus("cancelled")} disabled={isSubmitting}><Icon icon={XCircle} size={16} />拒绝</Button>
            </>
          )}
          {order.status === "confirmed" && (
            <Button onClick={() => updateStatus("processing")} disabled={isSubmitting}>开始处理</Button>
          )}
          {order.status === "processing" && (
            <Button onClick={() => updateStatus("completed")} disabled={isSubmitting}><Icon icon={Upload} size={16} />上传交付并完成</Button>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
