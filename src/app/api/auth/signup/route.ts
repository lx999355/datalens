import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/shared/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password } = body

    // Validation
    const errors: Record<string, string> = {}

    if (!username || username.length < 3 || username.length > 30) {
      errors.username = "用户名需要3-30个字符"
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(username || "")) {
      errors.username = "用户名需以字母开头，仅含字母数字下划线"
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "请输入有效的邮箱地址"
    }
    if (!password || password.length < 8) {
      errors.password = "密码至少8位"
    }
    if (password && !/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      errors.password = "密码需包含字母和数字"
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "参数校验失败", details: errors } },
        { status: 400 }
      )
    }

    // Check uniqueness
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    })
    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: { code: "VALIDATION_ERROR", message: "用户名已被注册" } },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "邮箱已被注册" } },
        { status: 409 }
      )
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    })

    return NextResponse.json({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "注册失败，请稍后重试" } },
      { status: 500 }
    )
  }
}