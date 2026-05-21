import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  if ((session.user as any).role !== "super_admin" && (session.user as any).role !== "sub_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })

  const body = await request.json()
  const data: Record<string, unknown> = {}
  if (body.status) data.status = body.status
  if (body.startDate) data.startDate = new Date(body.startDate)
  if (body.endDate) data.endDate = new Date(body.endDate)
  if (body.customReportRemaining !== undefined) data.customReportRemaining = body.customReportRemaining

  const sub = await prisma.userSubscription.update({ where: { id }, data, include: { user: true } })

  // Notify user on activation
  if (body.status === "active") {
    await prisma.notification.create({ data: { userId: sub.userId, type: "subscription_activated", content: `订阅已激活`, link: "/dashboard/subscription" } })
  }

  return NextResponse.json({ data: sub })
}
