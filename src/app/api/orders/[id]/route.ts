import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const userId = (session.user as any).id as string
  const order = await prisma.order.findUnique({ where: { id }, include: { user: { select: { username: true, avatar: true } } } })
  if (!order) return NextResponse.json({ error: { code: "NOT_FOUND", message: "订单不存在" } }, { status: 404 })
  if (order.userId !== userId) return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })
  return NextResponse.json({ data: order })
}
