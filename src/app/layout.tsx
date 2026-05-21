import type { Metadata } from "next"
import { Inter, Fira_Code } from "next/font/google"
import "./globals.css"
import { MeshGradientBg } from "@/shared/ui/MeshGradientBg"
import { DotGridBg } from "@/shared/ui/DotGridBg"
import { CursorGlow } from "@/shared/ui/CursorGlow"
import { ParticleBackground } from "@/shared/ui/ParticleBackground"
import { ToastProvider } from "@/shared/ui/Toast"
import { AuthProvider } from "@/shared/lib/auth-provider"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "DataLens - 数据报告与图表分享平台",
  description: "上传数据分析报告和可视化图表，分享洞察，连接数据爱好者",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="relative min-h-screen">
        <AuthProvider>
          <ToastProvider>
            <MeshGradientBg />
            <DotGridBg />
            <CursorGlow />
            <ParticleBackground />
            <main className="relative z-10 min-h-screen">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}