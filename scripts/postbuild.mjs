// 构建后删 node_modules 中 SSR 不需要的包
import { readdirSync, rmSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const NM = join(__dirname, "..", "node_modules")

// SSR运行时必需的顶层包（及其传递依赖自动保留）
const KEEP = new Set([
  "@prisma", ".prisma",    // 数据库
  "next", "@next",          // Next.js
  "react", "react-dom", "scheduler", "react-is", "tslib", // React
  "next-auth", "@auth", "@panva", "jose", "preact", // Auth
  "bcryptjs",               // 密码
  "cos-nodejs-sdk-v5",     // COS上传
  "clsx", "tailwind-merge", // 工具
  "framer-motion",          // 动画
  "lucide-react",           // 图标
  "tw-animate-css",         // CSS动画
  // 传递依赖
  "cookie", "uuid", "nanoid", "picocolors", "source-map",
  "client-only", "server-only", "tslib", "react-transition-group",
  "loose-envify", "js-tokens",
])

function shouldKeep(name) {
  if (KEEP.has(name)) return true
  // 保留以 @ 开头的 scoped packages（除已知不需要的）
  if (name.startsWith("@") && !name.startsWith("@types") && !name.startsWith("@eslint") && !name.startsWith("@babel") && !name.startsWith("@swc") && !name.startsWith("@esbuild") && !name.startsWith("@img") && !name.startsWith("@emnapi")) {
    return true
  }
  return false
}

if (!existsSync(NM)) { console.log("No node_modules"); process.exit(0) }

let total = 0
for (const name of readdirSync(NM)) {
  if (shouldKeep(name)) continue
  const p = join(NM, name)
  try { rmSync(p, { recursive: true, force: true }); total++ } catch {}
}

console.log(`Postbuild: removed ${total} packages`)
