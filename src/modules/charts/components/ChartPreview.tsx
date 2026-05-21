"use client"
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ScatterChart, Scatter, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"

interface ChartPreviewProps {
  type: string
  data: { headers: string[]; rows: string[][] }
  xAxis: string
  yAxis: string
  colors: string[]
  title?: string
}

export function ChartPreview({ type, data, xAxis, yAxis, colors, title }: ChartPreviewProps) {
  const xIdx = data.headers.indexOf(xAxis)
  const yIdx = data.headers.indexOf(yAxis)

  if (xIdx === -1 || yIdx === -1) {
    return <p className="text-muted-foreground text-sm">请选择X轴和Y轴</p>
  }

  const chartData = data.rows.map((row) => ({
    name: row[xIdx] || "",
    value: parseFloat(row[yIdx]) || 0,
    [xAxis]: row[xIdx] || "",
    [yAxis]: parseFloat(row[yIdx]) || 0,
  }))

  if (title) {
    // nothing extra needed, title prop for context
  }

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="rgba(248,250,252,0.6)" fontSize={12} />
              <YAxis stroke="rgba(248,250,252,0.6)" fontSize={12} />
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="rgba(248,250,252,0.6)" fontSize={12} />
              <YAxis stroke="rgba(248,250,252,0.6)" fontSize={12} />
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem" }} />
              <Line type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={2} dot={{ fill: colors[0] }} />
            </LineChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey={xAxis} name={xAxis} stroke="rgba(248,250,252,0.6)" fontSize={12} />
              <YAxis dataKey={yAxis} name={yAxis} stroke="rgba(248,250,252,0.6)" fontSize={12} />
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem" }} />
              <Scatter name="数据" data={chartData} fill={colors[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        )
      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="rgba(248,250,252,0.6)" fontSize={12} />
              <YAxis stroke="rgba(248,250,252,0.6)" fontSize={12} />
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem" }} />
              <Area type="monotone" dataKey="value" stroke={colors[0]} fill={`${colors[0]}33`} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )
      case "radar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="name" stroke="rgba(248,250,252,0.6)" fontSize={12} />
              <PolarRadiusAxis stroke="rgba(248,250,252,0.6)" />
              <Radar name="值" dataKey="value" stroke={colors[0]} fill={`${colors[0]}33`} />
              <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem" }} />
            </RadarChart>
          </ResponsiveContainer>
        )
      default:
        return <p className="text-muted-foreground">不支持的图表类型</p>
    }
  }

  return <div>{renderChart()}</div>
}