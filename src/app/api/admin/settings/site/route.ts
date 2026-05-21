import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  if ((session.user as any).role !== "super_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "仅超级管理员可操作" } }, { status: 403 })

  const configs = await prisma.siteConfig.findMany()
  const data: Record<string, string> = {}
  configs.forEach((c: { key: string; value: string }) => { data[c.key] = c.value })
  return NextResponse.json({ data })
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  if ((session.user as any).role !== "super_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "仅超级管理员可操作" } }, { status: 403 })

  const body = await request.json()
  const results = await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteConfig.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } })
    )
  )
  return NextResponse.json({ data: results })
}
