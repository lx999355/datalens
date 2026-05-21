import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) return NextResponse.json({ error: { code: "NOT_FOUND", message: "订单不存在" } }, { status: 404 })
  if (order.status !== "pending_payment") return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "只能取消待支付订单" } }, { status: 400 })
  const updated = await prisma.order.update({ where: { id }, data: { status: "cancelled" } })
  return NextResponse.json({ data: updated })
}
