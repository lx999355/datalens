import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
      "node_modules/.pnpm/**",
      "node_modules/**/*.map",
      "node_modules/**/*.d.ts",
      "node_modules/**/*.md",
      "node_modules/**/LICENSE*",
      "node_modules/**/CHANGELOG*",
      "node_modules/**/README*",
    ],
  },
}

export default nextConfig
