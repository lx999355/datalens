import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { PAGE_SIZES } from "@/shared/lib/constants"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const userId = (session.user as any).id as string
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1")
  const type = request.nextUrl.searchParams.get("type")

  const where: Record<string, unknown> = { userId, ...(type && { type }) }
  const [items, total] = await Promise.all([
    prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZES.notifications, take: PAGE_SIZES.notifications }),
    prisma.notification.count({ where }),
  ])
  return NextResponse.json({ data: { items, total, page, pageSize: PAGE_SIZES.notifications, totalPages: Math.ceil(total / PAGE_SIZES.notifications) } })
}
