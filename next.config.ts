import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 仅服务端使用的包需要外部化（客户端库由 Next.js 自行打包到浏览器 bundle）
  serverExternalPackages: ["@prisma/client", "bcryptjs"],

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
    // 允许从 src 目录外导入
    optimizePackageImports: ["lucide-react"],
  },
}

export default nextConfig
