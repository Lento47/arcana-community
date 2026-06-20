// Bun on Windows fails to extract dist/ from ai@6.0.168 tarball.
// Workaround: copy pre-extracted dist from vendor/ into node_modules/ai/
const { existsSync, cpSync } = require("fs")
const { join } = require("path")

const root = join(__dirname, "..")
const src = join(root, "vendor", "dist")
const dest = join(root, "node_modules", "ai", "dist")

if (!existsSync(src)) process.exit(0) // vendor not present (CI Linux — not needed)
if (existsSync(join(dest, "index.js"))) process.exit(0) // already fixed

console.log("[arcana] fixing ai package (bun Windows workaround)...")
cpSync(src, dest, { recursive: true })
console.log("[arcana] ai package fixed")
