import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  if ((session.user as any).role !== "super_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "仅超级管理员可操作" } }, { status: 403 })

  const plans = await prisma.subscriptionPlan.findMany({ orderBy: { price: "asc" } })
  return NextResponse.json({ data: plans })
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  if ((session.user as any).role !== "super_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "仅超级管理员可操作" } }, { status: 403 })

  const { plans } = await request.json()
  const results = await Promise.all(
    plans.map((p: any) => prisma.subscriptionPlan.update({ where: { id: p.id }, data: { price: p.price, customReportCount: p.customReportCount, isActive: p.isActive } }))
  )
  return NextResponse.json({ data: results })
}
