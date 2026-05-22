import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 外部化不需要在 SSR 中打包的包（不能与 transpilePackages 冲突）
  serverExternalPackages: [
    "@prisma/client",
    "bcryptjs",
    "html2canvas",
    "xlsx",
    "jose",
    "cos-nodejs-sdk-v5",
    "typescript",
    "prisma"
  ],

  // 允许 COS 存储桶图片
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "datalens-uploads-1419958246.cos.ap-guangzhou.myqcloud.com",
      },
    ],
  },

  // 实验性功能
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
}

export default nextConfig
