// 删除 node_modules 中不需要的冗余文件，减少部署包体积
import { readdirSync, statSync, rmSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..", "node_modules")

function rmIfExists(path) {
  if (existsSync(path)) {
    try { rmSync(path, { recursive: true, force: true }) } catch {}
  }
}

// 大型非核心目录
rmIfExists(join(ROOT, "cos-nodejs-sdk-v5/demo"))
rmIfExists(join(ROOT, "cos-nodejs-sdk-v5/test"))
rmIfExists(join(ROOT, "recharts/umd"))

// 删掉 Prisma 引擎二进制（用了 Neon HTTP adapter，不需要 Rust 引擎）
// 这些文件单个 40-50MB，是导致包体积超限的主要原因
function deletePrismaEngines(dir) {
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
        lc.includes("prisma-fmt")
      ) {
        const full = join(dir, entry)
        try { rmSync(full, { force: true }) } catch {}
      }
    }
  } catch {}
}

deletePrismaEngines(join(ROOT, ".prisma"))
deletePrismaEngines(join(ROOT, "@prisma/engines"))
deletePrismaEngines(join(ROOT, "@prisma/client"))

// 递归删除 docs/test/examples 目录、.map 和 .md 文件
function walk(dir, depth = 0) {
  if (depth > 3) return
  let entries
  try { entries = readdirSync(dir) } catch { return }

  for (const name of entries) {
    if (name.startsWith(".")) continue
    const full = join(dir, name)
    let st
    try { st = statSync(full) } catch { continue }
    if (!st.isDirectory()) {
      if (depth >= 2 && (name.endsWith(".map") || name.endsWith(".md"))) {
        try { rmSync(full, { force: true }) } catch {}
      }
      continue
    }
    const lc = name.toLowerCase()
    if (lc === "docs" || lc === "test" || lc === "tests" || lc === "__tests__" || lc === "examples" || lc === "demo") {
      try { rmSync(full, { recursive: true, force: true }) } catch {}
      continue
    }
    walk(full, depth + 1)
  }
}

walk(ROOT)

// 删掉 Prisma CLI 自身的引擎文件
rmIfExists(join(ROOT, "../node_modules/prisma/engines"))

console.log("Pruned node_modules")
