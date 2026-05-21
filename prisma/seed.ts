import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // 1. 创建超级管理员
  const adminPassword = await bcrypt.hash("LX20040605", 12)
  const admin = await prisma.user.upsert({
    where: { username: "15772104540" },
    update: { password: adminPassword, role: "super_admin" },
    create: {
      username: "15772104540",
      email: "15772104540@datalens.cn",
      password: adminPassword,
      role: "super_admin",
      bio: "DataLens 超级管理员",
      isActive: true,
    },
  })
  console.log(`  ✓ 超级管理员: ${admin.username}`)

  // 1b. 创建普通测试用户
  const userPassword = await bcrypt.hash("12345", 12)
  const user = await prisma.user.upsert({
    where: { username: "1437116497@qq.com" },
    update: { password: userPassword, role: "user" },
    create: {
      username: "1437116497@qq.com",
      email: "1437116497@qq.com",
      password: userPassword,
      role: "user",
      bio: "普通测试用户",
      isActive: true,
    },
  })
  console.log(`  ✓ 普通用户: ${user.username}`)

  // 2. 创建订阅方案
  const plans = [
    {
      name: "月付方案",
      type: "monthly",
      price: 29.9,
      customReportCount: 2,
    },
    {
      name: "年付方案",
      type: "yearly",
      price: 299,
      customReportCount: 30,
    },
    {
      name: "单次定制",
      type: "single",
      price: 99,
      customReportCount: 1,
    },
  ]

  for (const plan of plans) {
    const created = await prisma.subscriptionPlan.upsert({
      where: { id: plan.type }, // This won't work for upsert — use create
      update: {},
      create: {
        id: plan.type,
        name: plan.name,
        type: plan.type,
        price: plan.price,
        customReportCount: plan.customReportCount,
      },
    })
    console.log(`  ✓ 方案: ${created.name} (¥${created.price})`)
  }

  // 3. 创建站点配置
  const siteConfigs = [
    { key: "site_name", value: "DataLens" },
    { key: "site_description", value: "数据报告与图表分享平台" },
    { key: "payment_wechat_qr", value: "/uploads/qrcode/wechat.jpg" },
    { key: "payment_alipay_qr", value: "/uploads/qrcode/alipay.jpg" },
    { key: "max_file_size_mb", value: "100" },
    { key: "allow_registration", value: "true" },
  ]

  for (const config of siteConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
    console.log(`  ✓ 配置: ${config.key} = ${config.value}`)
  }

  console.log("\n✅ Seed 完成！")
  console.log("   超级管理员: 15772104540 / LX20040605")
  console.log("   普通用户:   1437116497@qq.com / 12345")
}

main()
  .catch((e) => {
    console.error("❌ Seed 失败:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })