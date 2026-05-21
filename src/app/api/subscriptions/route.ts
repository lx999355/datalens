import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const userId = (session.user as any).id as string
  const subscriptions = await prisma.userSubscription.findMany({
    where: { userId }, include: { plan: true }, orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({ data: subscriptions })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const userId = (session.user as any).id as string
  const { planId } = await request.json()
  if (!planId) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "请选择方案" } }, { status: 400 })

  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId, isActive: true } })
  if (!plan) return NextResponse.json({ error: { code: "NOT_FOUND", message: "方案不存在" } }, { status: 404 })

  // Create a subscription order (pending_payment)
  const order = await prisma.order.create({
    data: { userId, type: "subscription", status: "pending_payment", amount: plan.price },
  })
  return NextResponse.json({ data: order }, { status: 201 })
}
