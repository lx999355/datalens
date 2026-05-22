import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 关闭图片优化，防止 opennextjs 插件注入 sharp 等重型依赖
  images: {
    unoptimized: true,
  },

  // tree-shake 优化
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
}

export default nextConfig
