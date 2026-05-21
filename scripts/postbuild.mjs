// 构建后删除 SSR 运行时不需要的包
import { rmSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const NM = join(__dirname, "..", "node_modules")

function del(name) {
  const p = join(NM, name)
  if (existsSync(p)) {
    rmSync(p, { recursive: true, force: true })
  }
}

// === 构建工具（运行时100%不需要）===
del("typescript")
del("eslint")
del("@eslint")
del("@typescript-eslint")
del("eslint-config-next")
del("eslint-plugin-react-hooks")
del("eslint-plugin-react")
del("eslint-import-resolver-typescript")
del("eslint-plugin-import")
del("eslint-plugin-jsx-a11y")
del("@humanfs")
del("@humanwhocodes")
del("eslint-scope")
del("eslint-visitor-keys")
del("espree")
del("esquery")
del("esrecurse")
del("estraverse")
del("globals")
del("tsx")
del("@swc")
del("@esbuild")
del("esbuild")
del("lightningcss")
del("lightningcss-win32-x64-msvc")
del("@emnapi")
del("@napi-rs")
del("@rspack-resolver")
del("@tybys")

// === Babel ===
del("@babel")
del("core-js-compat")
del("convert-source-map")
del("gensync")

// === 图像处理（未使用）===
del("@img")
del("sharp")
del("detect-libc")

// === 测试 ===
del("fast-check")
del("pure-rand")

// === 客户端专用（ssr:false 或仅客户端导入）===
// html2canvas - 仅 chart generate 页面的客户端截图
del("html2canvas")
// xlsx - 仅 chart generate 页面客户端解析CSV
del("xlsx")
del("codepage")
del("cfb")
del("adler-32")
del("crc-32")
del("frac")
del("ssf")
del("wmf")

// === 其他大型不必要的 ===
del("axe-core")
del("aria-query")
del("caniuse-lite")

console.log("Postbuild cleanup done")
