import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "请先登录" } }, { status: 401 })
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) return NextResponse.json({ error: { code: "NOT_FOUND", message: "订单不存在" } }, { status: 404 })
  if (order.status !== "pending_payment") return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "订单状态不可支付" } }, { status: 400 })

  // Get payment QR codes from SiteConfig
  const [wechatConfig, alipayConfig] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { key: "paymentQRWechat" } }),
    prisma.siteConfig.findUnique({ where: { key: "paymentQRAlipay" } }),
  ])

  return NextResponse.json({
    data: {
      orderId: order.id,
      amount: order.amount,
      wechatQR: wechatConfig?.value || "/uploads/qrcode/wechat.jpg",
      alipayQR: alipayConfig?.value || "/uploads/qrcode/alipay.jpg",
    },
  })
}
