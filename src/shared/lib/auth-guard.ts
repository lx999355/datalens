import { auth } from "./auth"
import { NextResponse } from "next/server"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  }
  return null
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  }
  const role = (session.user as any).role
  if (role !== "super_admin" && role !== "sub_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })
  }
  return null
}

export async function requireSuperAdmin() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  }
  if ((session.user as any).role !== "super_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "仅超级管理员可操作" } }, { status: 403 })
  }
  return null
}