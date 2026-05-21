"use client"
import { useState, useEffect } from "react"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Button } from "@/shared/ui/Button"
import { Input } from "@/shared/ui/Input"
import { Icon } from "@/shared/ui/Icon"
import { useToast } from "@/shared/ui/Toast"
import { Save } from "lucide-react"

export default function AdminSettingsPage() {
  const { addToast } = useToast()
  const [plans, setPlans] = useState<any[]>([])
  const [siteConfig, setSiteConfig] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings/plans").then(r => r.json()).then(j => setPlans(j.data || []))
    fetch("/api/admin/settings/site").then(r => r.json()).then(j => setSiteConfig(j.data || {}))
  }, [])

  const savePlans = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings/plans", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plans }),
      })
      if (res.ok) addToast("success", "定价已保存")
      else addToast("error", "保存失败")
    } catch { addToast("error", "保存失败") }
    finally { setIsSaving(false) }
  }

  const saveSite = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings/site", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteConfig),
      })
      if (res.ok) addToast("success", "站点配置已保存")
      else addToast("error", "保存失败")
    } catch { addToast("error", "保存失败") }
    finally { setIsSaving(false) }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-foreground">系统设置</h1>

      <GlassCard level={2} className="p-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">订阅定价</h2>
        <div className="space-y-4">
          {plans.map((plan, i) => (
            <div key={plan.id} className="grid grid-cols-4 gap-4 items-end">
              <Input label={plan.name} value={plan.name} disabled />
              <Input label="价格 (¥)" type="number" value={String(plan.price)} onChange={(e) => {
                const next = [...plans]; next[i] = { ...next[i], price: parseFloat(e.target.value) || 0 }; setPlans(next)
              }} />
              <Input label="定制次数" type="number" value={String(plan.customReportCount)} onChange={(e) => {
                const next = [...plans]; next[i] = { ...next[i], customReportCount: parseInt(e.target.value) || 0 }; setPlans(next)
              }} />
              <Button variant="secondary" onClick={() => {
                const next = [...plans]; next[i] = { ...next[i], isActive: !next[i].isActive }; setPlans(next)
              }}>{plan.isActive ? "禁用" : "启用"}</Button>
            </div>
          ))}
        </div>
        <Button className="mt-6" onClick={savePlans} disabled={isSaving}><Icon icon={Save} size={16} />保存定价</Button>
      </GlassCard>

      <GlassCard level={2} className="p-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">站点配置</h2>
        <div className="space-y-4">
          <Input label="站点名称" value={siteConfig.siteName || ""} onChange={(e) => setSiteConfig({ ...siteConfig, siteName: e.target.value })} />
          <Input label="站点描述" value={siteConfig.siteDescription || ""} onChange={(e) => setSiteConfig({ ...siteConfig, siteDescription: e.target.value })} />
          <Input label="联系邮箱" value={siteConfig.contactEmail || ""} onChange={(e) => setSiteConfig({ ...siteConfig, contactEmail: e.target.value })} />
          <Input label="ICP备案号" value={siteConfig.icpBeian || ""} onChange={(e) => setSiteConfig({ ...siteConfig, icpBeian: e.target.value })} />
          <Input label="微信收款码URL" value={siteConfig.paymentQRWechat || ""} onChange={(e) => setSiteConfig({ ...siteConfig, paymentQRWechat: e.target.value })} />
          <Input label="支付宝收款码URL" value={siteConfig.paymentQRAlipay || ""} onChange={(e) => setSiteConfig({ ...siteConfig, paymentQRAlipay: e.target.value })} />
        </div>
        <Button className="mt-6" onClick={saveSite} disabled={isSaving}><Icon icon={Save} size={16} />保存配置</Button>
      </GlassCard>
    </div>
  )
}
