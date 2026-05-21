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
      // 删除 map/md/license/changelog
      if (depth >= 1 && (
        name.endsWith(".map") || name.endsWith(".md") ||
        name.startsWith("LICENSE") || name.startsWith("CHANGELOG") || name === "README.md"
      )) {
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
console.log("Pruned")
