import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/shared/lib/prisma"

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")

  if (!username) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "请提供用户名" } },
      { status: 400 }
    )
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  return NextResponse.json({ data: { available: !existing } })
}