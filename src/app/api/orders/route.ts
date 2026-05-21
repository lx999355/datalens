import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { PAGE_SIZES } from "@/shared/lib/constants"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const userId = (session.user as any).id as string
  const status = request.nextUrl.searchParams.get("status")
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1")

  const where: Record<string, unknown> = { userId, ...(status && { status }) }
  const [items, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZES.orders, take: PAGE_SIZES.orders }),
    prisma.order.count({ where }),
  ])
  return NextResponse.json({ data: { items, total, page, pageSize: PAGE_SIZES.orders, totalPages: Math.ceil(total / PAGE_SIZES.orders) } })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const userId = (session.user as any).id as string
  const body = await request.json()
  const { type, amount, requirement, attachments } = body

  if (!type || amount === undefined) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "缺少必填字段" } }, { status: 400 })
  }

  // Check if using subscription custom count
  if (type === "custom" && body.useSubscription) {
    const sub = await prisma.userSubscription.findFirst({ where: { userId, status: "active", customReportRemaining: { gt: 0 } } })
    if (sub) {
      const order = await prisma.$transaction(async (tx: any) => {
        const updated = await tx.userSubscription.update({
          where: { id: sub.id, customReportRemaining: { gt: 0 } },
          data: { customReportRemaining: { decrement: 1 } },
        })
        if (!updated) throw new Error("次数不足")
        return tx.order.create({ data: { userId, type, status: "confirmed", amount: 0, requirement: requirement ? JSON.stringify(requirement) : null, attachments: attachments ? JSON.stringify(attachments) : null } })
      })
      return NextResponse.json({ data: order }, { status: 201 })
    }
  }

  const order = await prisma.order.create({
    data: { userId, type, status: "pending_payment", amount, requirement: requirement ? JSON.stringify(requirement) : null, attachments: attachments ? JSON.stringify(attachments) : null },
  })
  return NextResponse.json({ data: order }, { status: 201 })
}
