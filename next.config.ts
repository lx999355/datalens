import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Prisma 和客户端库在 serverless 环境需要外部化
  serverExternalPackages: ["@prisma/client", "bcryptjs", "recharts", "html2canvas", "xlsx", "framer-motion"],

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
    optimizePackageImports: ["lucide-react", "recharts"],
  },
}

export default nextConfig
