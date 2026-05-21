import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { PAGE_SIZES } from "@/shared/lib/constants"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const role = (session.user as any).role
  if (role !== "super_admin" && role !== "sub_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })

  const search = request.nextUrl.searchParams.get("search")
  const roleFilter = request.nextUrl.searchParams.get("role")
  const status = request.nextUrl.searchParams.get("status")
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1")

  const where: Record<string, unknown> = {
    ...(search && { OR: [{ username: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }),
    ...(roleFilter && { role: roleFilter }),
    ...(status && { isActive: status === "active" }),
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where, orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZES.adminUsers, take: PAGE_SIZES.adminUsers,
      select: { id: true, username: true, email: true, role: true, avatar: true, isActive: true, createdAt: true },
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ data: { items, total, page, pageSize: PAGE_SIZES.adminUsers, totalPages: Math.ceil(total / PAGE_SIZES.adminUsers) } })
}
