"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/shared/ui/GlassCard"
import { Button } from "@/shared/ui/Button"
import { Input } from "@/shared/ui/Input"
import { Select } from "@/shared/ui/Select"
import { Icon } from "@/shared/ui/Icon"
import { useToast } from "@/shared/ui/Toast"
import { Badge } from "@/shared/ui/Badge"
import { Upload, ArrowLeft, ArrowRight, Check } from "lucide-react"
import dynamic from "next/dynamic"
import { MagneticButton } from "@/shared/ui/MagneticButton"

const ChartPreview = dynamic(() => import("@/modules/charts/components/ChartPreview").then(m => ({ default: m.ChartPreview })), { ssr: false })

const CHART_TYPES = [
  { value: "bar", label: "柱状图" },
  { value: "line", label: "折线图" },
  { value: "pie", label: "饼图" },
  { value: "scatter", label: "散点图" },
  { value: "area", label: "面积图" },
  { value: "radar", label: "雷达图" },
]

const COLOR_SCHEMES = [
  { name: "蓝紫", colors: ["#60a5fa", "#8b5cf6", "#38bdf8", "#a78bfa", "#3b82f6"] },
  { name: "暖色", colors: ["#f97316", "#eab308", "#ef4444", "#f59e0b", "#dc2626"] },
  { name: "绿色", colors: ["#34d399", "#10b981", "#6ee7b7", "#059669", "#22c55e"] },
  { name: "多彩", colors: ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#8b5cf6"] },
  { name: "单色蓝", colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"] },
]

export default function GenerateChartPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0)
  const [dataFile, setDataFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<{ headers: string[]; rows: string[][] } | null>(null)
  const [chartType, setChartType] = useState("bar")
  const [xAxis, setXAxis] = useState("")
  const [yAxis, setYAxis] = useState("")
  const [colorScheme, setColorScheme] = useState(0)
  const [title, setTitle] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const steps = ["上传数据", "选择类型", "配置图表", "预览保存"]

  const parseCSV = async (file: File) => {
    const XLSX = await import("xlsx")
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer)
    const ws = wb.Sheets[wb.SheetNames[0]]
    const json = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 })
    if (json.length < 2) { addToast("error", "数据行数不足"); return }
    const headers = json[0].map(String)
    const rows = json.slice(1, 21).map(row => row.map(String))
    setParsedData({ headers, rows })
    setXAxis(headers[0] || "")
    setYAxis(headers[1] || "")
    setTitle(file.name.replace(/\.[^.]+$/, ""))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 10 * 1024 * 1024) { addToast("warning", "文件不能超过10MB"); return }
    setDataFile(f)
    await parseCSV(f)
  }

  const handleSave = async () => {
    if (!dataFile || !title) { addToast("warning", "请完善信息"); return }
    setIsSaving(true)
    try {
      // Upload data file
      const dataFormData = new FormData()
      dataFormData.append("file", dataFile)
      dataFormData.append("directory", "charts")
      const uploadRes = await fetch("/api/upload", { method: "POST", body: dataFormData })
      const uploadJson = await uploadRes.json()
      const sourceDataUrl = uploadJson.data.url

      // Capture chart as PNG
      const chartEl = document.querySelector("[data-chart-preview]")
      let fileUrl = ""
      if (chartEl) {
        const html2canvas = (await import("html2canvas")).default
        const canvas = await html2canvas(chartEl as HTMLElement, { backgroundColor: "#020617" })
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"))
        const pngFile = new File([blob], `${title}.png`, { type: "image/png" })

        const pngFormData = new FormData()
        pngFormData.append("file", pngFile)
        const pngRes = await fetch("/api/upload", { method: "POST", body: pngFormData })
        const pngJson = await pngRes.json()
        fileUrl = pngJson.data.url
      }

      // Create chart record
      const res = await fetch("/api/charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "generated",
          title,
          visibility: "public",
          fileUrl,
          chartType,
          chartConfig: {
            colors: COLOR_SCHEMES[colorScheme].colors,
            xAxis,
            yAxis,
          },
          sourceDataUrl,
        }),
      })

      if (!res.ok) throw new Error("保存失败")
      addToast("success", "图表创建成功")
      router.push("/dashboard/charts")
    } catch (err) {
      addToast("error", "保存失败")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">数据生成图表</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-white/[0.05] text-muted-foreground"
            }`}>{i + 1}</div>
            <span className={`text-sm ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-white/[0.1]" />}
          </div>
        ))}
      </div>

      {/* Step 0: Upload Data */}
      {step === 0 && (
        <GlassCard level={2} className="p-8">
          <div className="border-2 border-dashed border-white/[0.1] rounded-2xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => fileRef.current?.click()}>
            <Icon icon={Upload} size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {dataFile ? dataFile.name : "点击上传 CSV/Excel 文件 (最大10MB)"}
            </p>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} accept=".csv,.xls,.xlsx" />
          </div>
          {parsedData && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-foreground mb-2">数据预览 (前20行)</h3>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                <table className="w-full text-sm">
                  <thead><tr className="bg-white/[0.03]">
                    {parsedData.headers.map(h => <th key={h} className="px-3 py-2 text-left text-muted-foreground">{h}</th>)}
                  </tr></thead>
                  <tbody>{parsedData.rows.map((row, i) => (
                    <tr key={i} className="border-t border-white/[0.04]">
                      {row.map((cell, j) => <td key={j} className="px-3 py-2 text-foreground">{cell}</td>)}
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button onClick={() => setStep(1)} disabled={!parsedData}>下一步 <Icon icon={ArrowRight} size={16} /></Button>
          </div>
        </GlassCard>
      )}

      {/* Step 1: Select Chart Type */}
      {step === 1 && (
        <GlassCard level={2} className="p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">选择图表类型</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CHART_TYPES.map(t => (
              <button key={t.value} onClick={() => setChartType(t.value)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  chartType === t.value ? "border-primary/50 bg-primary/10 text-primary" : "border-white/[0.06] text-muted-foreground hover:border-white/[0.1]"
                }`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="secondary" onClick={() => setStep(0)}><Icon icon={ArrowLeft} size={16} />上一步</Button>
            <Button onClick={() => setStep(2)}>下一步 <Icon icon={ArrowRight} size={16} /></Button>
          </div>
        </GlassCard>
      )}

      {/* Step 2: Configure */}
      {step === 2 && (
        <GlassCard level={2} className="p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">图表配置</h3>
          <div className="space-y-4">
            <Input label="图表标题" value={title} onChange={(e) => setTitle(e.target.value)} />
            {parsedData && (
              <div className="grid grid-cols-2 gap-4">
                <Select label="X轴" value={xAxis} onChange={(e) => setXAxis(e.target.value)}
                  options={parsedData.headers.map(h => ({ value: h, label: h }))} />
                <Select label="Y轴" value={yAxis} onChange={(e) => setYAxis(e.target.value)}
                  options={parsedData.headers.map(h => ({ value: h, label: h }))} />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">颜色方案</label>
              <div className="flex gap-3">
                {COLOR_SCHEMES.map((scheme, i) => (
                  <button key={i} onClick={() => setColorScheme(i)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      colorScheme === i ? "border-primary scale-110" : "border-transparent"
                    }`}
                    style={{ background: `linear-gradient(135deg, ${scheme.colors[0]}, ${scheme.colors[1]})` }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="secondary" onClick={() => setStep(1)}><Icon icon={ArrowLeft} size={16} />上一步</Button>
            <Button onClick={() => setStep(3)}>下一步 <Icon icon={ArrowRight} size={16} /></Button>
          </div>
        </GlassCard>
      )}

      {/* Step 3: Preview & Save */}
      {step === 3 && (
        <GlassCard level={2} className="p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">预览与保存</h3>
          <div data-chart-preview className="bg-background rounded-2xl p-4 mb-6 min-h-[300px] flex items-center justify-center">
            {parsedData ? (
              <ChartPreview
                type={chartType}
                data={parsedData}
                xAxis={xAxis}
                yAxis={yAxis}
                colors={COLOR_SCHEMES[colorScheme].colors}
                title={title}
              />
            ) : (
              <p className="text-muted-foreground">暂无数据</p>
            )}
          </div>
          <div className="flex justify-between">
            <MagneticButton maxOffset={6}>
              <Button variant="secondary" onClick={() => setStep(2)}><Icon icon={ArrowLeft} size={16} />上一步</Button>
            </MagneticButton>
            <MagneticButton maxOffset={6}>
              <Button onClick={handleSave} disabled={isSaving}>
                <Icon icon={Check} size={16} />{isSaving ? "保存中..." : "保存图表"}
              </Button>
            </MagneticButton>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
