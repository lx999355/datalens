import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { uploadToCOS } from "@/shared/lib/cos"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  if ((session.user as any).role !== "super_admin" && (session.user as any).role !== "sub_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })
  const order = await prisma.order.findUnique({ where: { id }, include: { user: { select: { username: true, avatar: true, email: true } } } })
  if (!order) return NextResponse.json({ error: { code: "NOT_FOUND", message: "订单不存在" } }, { status: 404 })
  return NextResponse.json({ data: order })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  if ((session.user as any).role !== "super_admin" && (session.user as any).role !== "sub_admin") return NextResponse.json({ error: { code: "FORBIDDEN", message: "无权限" } }, { status: 403 })

  const formData = await request.formData()
  const status = formData.get("status") as string | null
  const adminNote = formData.get("adminNote") as string | null
  const deliverFile = formData.get("deliverFile") as File | null

  const data: Record<string, unknown> = {}
  if (status) data.status = status
  if (adminNote) data.adminNote = adminNote

  if (deliverFile) {
    const bytes = await deliverFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = deliverFile.name.split(".").pop()
    const key = `orders/${id}/delivery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const deliverUrl = await uploadToCOS(key, buffer, deliverFile.type)
    data.deliverUrl = deliverUrl
    data.deliverFileName = deliverFile.name
    data.deliverFileType = deliverFile.type
    data.deliverFileSize = deliverFile.size
  }

  const order = await prisma.order.update({ where: { id }, data })

  // Create notification for user
  if (status === "confirmed") {
    await prisma.notification.create({ data: { userId: order.userId, type: "order_status", content: `订单[${id.slice(-8)}]已确认`, link: `/dashboard/orders/${id}` } })
  } else if (status === "completed") {
    await prisma.notification.create({ data: { userId: order.userId, type: "order_completed", content: `订单[${id.slice(-8)}]已完成,请下载交付文件`, link: `/dashboard/orders/${id}` } })
  }

  return NextResponse.json({ data: order })
}
