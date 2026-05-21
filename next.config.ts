import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // 排除不必要的文件，减少 Serverless 函数体积 (EdgeOne Pages 限制 128MB)
  outputFileTracingExcludes: {
    "*": [
      // Prisma - 只保留需要的引擎二进制
      "node_modules/@prisma/engines/bin/**",
      "node_modules/@prisma/engines/query_engine-*",
      "node_modules/.prisma/client/query_engine-*",
      // TypeScript 源文件和 source maps
      "node_modules/**/*.ts",
      "node_modules/**/*.tsx",
      "node_modules/**/*.map",
      "node_modules/**/*.mjs.map",
      // 文档/测试/示例
      "node_modules/**/docs/**",
      "node_modules/**/test/**",
      "node_modules/**/tests/**",
      "node_modules/**/__tests__/**",
      "node_modules/**/*.md",
      "node_modules/**/LICENSE",
      "node_modules/**/CHANGELOG*",
      "node_modules/**/README*",
      "node_modules/**/CONTRIBUTING*",
      // COS SDK 非核心文件
      "node_modules/cos-nodejs-sdk-v5/demo/**",
      "node_modules/cos-nodejs-sdk-v5/test/**",
      // Recharts UMD 构建（仅客户端需要）
      "node_modules/recharts/umd/**",
      "node_modules/recharts/lib/**",
      // xlsx 非核心
      "node_modules/xlsx/dist/**",
      "node_modules/xlsx/types/**",
      // React DOM 服务端不需要的
      "node_modules/react-dom/test-utils/**",
      // Framer Motion 非核心
      "node_modules/framer-motion/dist/es/**",
      // Lucide React 图标源文件
      "node_modules/lucide-react/dist/esm/icons/**",
      // Next.js 编译产物（构建时已有）
      "node_modules/next/dist/compiled/@next/**",
      "node_modules/next/dist/compiled/@vercel/**",
      "node_modules/next/dist/compiled/webpack/**",
      "node_modules/next/dist/compiled/babel/**",
      // pnpm 的 virtual store
      "node_modules/.pnpm/**",
    ],
  },

  // Prisma 等服务端包不要重复打包
  serverExternalPackages: ["@prisma/client", "prisma"],
}

export default nextConfig
