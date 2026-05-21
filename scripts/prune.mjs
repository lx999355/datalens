// 删除 node_modules 中不需要的冗余文件，减少部署包体积
import { readdirSync, statSync, rmSync, existsSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname, "..", "node_modules")

function rmIfExists(path) {
  if (existsSync(path)) {
    try { rmSync(path, { recursive: true, force: true }) } catch {}
  }
}

// Heavy packages - remove non-essential directories
rmIfExists(join(ROOT, "cos-nodejs-sdk-v5/demo"))
rmIfExists(join(ROOT, "cos-nodejs-sdk-v5/test"))
rmIfExists(join(ROOT, "recharts/umd"))
rmIfExists(join(ROOT, "xlsx/dist"))
rmIfExists(join(ROOT, "xlsx/types"))
rmIfExists(join(ROOT, "framer-motion/dist/es"))

// Walk node_modules and delete docs, tests, maps, ts sources
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
      // Delete source maps, type defs, markdown in deep dirs
      if (depth >= 2 && (name.endsWith(".map") || name.endsWith(".d.ts") || name.endsWith(".md") || name.startsWith("LICENSE") || name.startsWith("CHANGELOG") || name === "README.md")) {
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
console.log("Pruned node_modules")
