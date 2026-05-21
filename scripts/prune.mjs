// 删除 node_modules 中不需要的冗余文件，减少部署包体积
// 保守策略：只删除明确不参与运行的文件
import { readdirSync, statSync, rmSync, existsSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname, "..", "node_modules")

function rmIfExists(path) {
  if (existsSync(path)) {
    try { rmSync(path, { recursive: true, force: true }) } catch {}
  }
}

// 明确可删的大型非核心目录
rmIfExists(join(ROOT, "cos-nodejs-sdk-v5/demo"))
rmIfExists(join(ROOT, "cos-nodejs-sdk-v5/test"))
rmIfExists(join(ROOT, "recharts/umd"))

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
      // 删除深层的 source maps 和 markdown
      if (depth >= 2 && (name.endsWith(".map") || name.endsWith(".md"))) {
        try { rmSync(full, { force: true }) } catch {}
      }
      continue
    }
    const lc = name.toLowerCase()
    // 只删除明确不参与运行的目录
    if (lc === "docs" || lc === "test" || lc === "tests" || lc === "__tests__" || lc === "examples" || lc === "demo") {
      try { rmSync(full, { recursive: true, force: true }) } catch {}
      continue
    }
    walk(full, depth + 1)
  }
}

walk(ROOT)
console.log("Pruned node_modules")
