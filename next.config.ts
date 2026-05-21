import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // standalone 输出：Next.js 文件追踪只打包实际引用的文件
  output: "standalone",

  // 外部包：不在 SSR 函数内重复打包，运行时从 node_modules 加载
  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "cos-nodejs-sdk-v5",
  ],
}

export default nextConfig
