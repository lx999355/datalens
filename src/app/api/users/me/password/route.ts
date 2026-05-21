import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const userId = (session.user as any).id as string
  const { currentPassword, newPassword } = await request.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "请输入当前密码和新密码" } }, { status: 400 })
  }
  if (newPassword.length < 8 || !/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "新密码至少8位，需包含字母和数字" } }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: { code: "NOT_FOUND", message: "用户不存在" } }, { status: 404 })

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "当前密码错误" } }, { status: 400 })

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
  return NextResponse.json({ data: { success: true } })
}
