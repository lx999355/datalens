// 用 standalone 的 traced node_modules 替换项目 node_modules
// Next.js 的 standalone 输出只包含实际 tracing 到的运行时文件，体积远小于完整 node_modules
import { cpSync, rmSync, existsSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT = join(__dirname, "..")
const STANDALONE = join(PROJECT, ".next", "standalone")
const STANDALONE_NM = join(STANDALONE, "node_modules")
const PROJECT_NM = join(PROJECT, "node_modules")

if (!existsSync(STANDALONE_NM)) {
  console.log("No standalone node_modules found, skipping swap")
  process.exit(0)
}

// 统计 standalone node_modules 大小
function getDirSize(dir) {
  let size = 0
  try {
    const entries = readdirSync(dir, { recursive: true })
    for (const entry of entries) {
      try {
        const { statSync } = require("fs")
        const s = statSync(join(dir, entry))
        if (s.isFile()) size += s.size
      } catch {}
    }
  } catch {}
  return size
}

const standaloneSize = getDirSize(STANDALONE_NM)
console.log(`Standalone node_modules: ${(standaloneSize / 1024 / 1024).toFixed(1)}MB`)

// 删除项目 node_modules
console.log("Removing project node_modules...")
rmSync(PROJECT_NM, { recursive: true, force: true })

// 把 standalone 的 node_modules 复制到项目根
console.log("Copying standalone node_modules to project...")
cpSync(STANDALONE_NM, PROJECT_NM, { recursive: true })

console.log("✅ Swapped to standalone node_modules")
