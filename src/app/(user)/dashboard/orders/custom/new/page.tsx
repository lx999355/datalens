"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Button } from "@/shared/ui/Button"
import { Input } from "@/shared/ui/Input"
import { Textarea } from "@/shared/ui/Textarea"
import { Select } from "@/shared/ui/Select"
import { Icon } from "@/shared/ui/Icon"
import { useToast } from "@/shared/ui/Toast"
import { useFetch } from "@/shared/hooks/useFetch"
import { Sparkles } from "lucide-react"
import { MagneticButton } from "@/shared/ui/MagneticButton"

export default function NewCustomOrderPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [form, setForm] = useState({ title: "", description: "", dataType: "", expectedFormat: "pdf", contact: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: subData } = useFetch<any>("/api/subscriptions")

  const activeSub = subData?.find((s: any) => s.status === "active")
  const remainingCustom = activeSub?.customReportRemaining || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description) { addToast("warning", "请填写必要信息"); return }
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom",
          amount: 0,
          useSubscription: !!activeSub && remainingCustom > 0,
          requirement: { title: form.title, description: form.description, dataType: form.dataType, expectedFormat: form.expectedFormat, contact: form.contact },
        }),
      })
      if (!res.ok) throw new Error("提交失败")
      const json = await res.json()
      addToast("success", "订单提交成功")
      if (json.data.status === "pending_payment") {
        router.push(`/dashboard/orders/${json.data.id}`)
      } else {
        router.push("/dashboard/orders")
      }
    } catch { addToast("error", "提交失败") }
    finally { setIsSubmitting(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">提交定制需求</h1>
      {activeSub && remainingCustom > 0 && (
        <GlassCard level={2} className="p-4 mb-6 border-success/20 bg-success/5">
          <p className="text-sm text-success">当前订阅剩余 <strong>{remainingCustom}</strong> 次定制次数，提交将自动使用</p>
        </GlassCard>
      )}
      <GlassCard level={2} className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="需求标题" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="简要描述你的需求" />
          <Textarea label="详细描述" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required placeholder="详细说明你想要的数据分析内容" />
          <Input label="数据类型" value={form.dataType} onChange={(e) => setForm({ ...form, dataType: e.target.value })} placeholder="如：销售数据、用户行为数据" />
          <Select label="期望交付格式" value={form.expectedFormat} onChange={(e) => setForm({ ...form, expectedFormat: e.target.value })}
            options={[{ value: "pdf", label: "PDF" }, { value: "word", label: "Word" }, { value: "excel", label: "Excel" }, { value: "ppt", label: "PPT" }]} />
          <Input label="联系方式" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="微信/手机号（方便联系）" />
          <div className="flex gap-3 justify-end">
            <MagneticButton maxOffset={6}>
              <Button variant="secondary" type="button" onClick={() => router.back()}>取消</Button>
            </MagneticButton>
            <MagneticButton maxOffset={6}>
              <Button type="submit" disabled={isSubmitting}>
                <Icon icon={Sparkles} size={16} />{isSubmitting ? "提交中..." : "提交需求"}
              </Button>
            </MagneticButton>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
