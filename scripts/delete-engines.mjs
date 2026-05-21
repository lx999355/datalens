// prisma generate 后运行：删除引擎二进制文件（已用 Neon HTTP adapter，不需要 Rust 引擎）
// 这些文件单个 40-50MB，是部署包超限的主要原因
import { readdirSync, rmSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..", "node_modules")

let deleted = 0

function deleteEngineFiles(dir) {
  if (!existsSync(dir)) return
  try {
    const entries = readdirSync(dir, { recursive: true })
    for (const entry of entries) {
      const lc = entry.toLowerCase()
      if (
        lc.includes("query_engine") ||
        lc.includes("schema_engine") ||
        lc.includes("migration_engine") ||
        lc.includes("libquery_engine") ||
        lc.includes("prisma-fmt") ||
        lc.includes("introspection-engine")
      ) {
        const full = join(dir, entry)
        try { rmSync(full, { force: true }); deleted++ } catch {}
      }
    }
  } catch {}
}

// 可能的位置
deleteEngineFiles(join(ROOT, ".prisma/client"))
deleteEngineFiles(join(ROOT, "@prisma/engines"))
deleteEngineFiles(join(ROOT, "@prisma/client"))
deleteEngineFiles(join(ROOT, "../node_modules/.pnpm"))

console.log(`Deleted ${deleted} Prisma engine binaries`)
