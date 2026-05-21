import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const currentRole = (session.user as any).role
  const currentUserId = (session.user as any).id
  if (currentRole !== "super_admin" && currentRole !== "sub_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })

  const body = await request.json()

  // Only super_admin can set super_admin role
  if (body.role === "super_admin" && currentRole !== "super_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "仅超级管理员可设置此角色" } }, { status: 403 })
  }

  // Cannot modify own role
  if (id === currentUserId && body.role) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "不能修改自己的角色" } }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  if (body.role) data.role = body.role
  if (body.isActive !== undefined) data.isActive = body.isActive

  const user = await prisma.user.update({ where: { id }, data, select: { id: true, username: true, email: true, role: true, isActive: true } })
  return NextResponse.json({ data: user })
}
