// Bun on Windows fails to extract dist/ from ai@6.0.168 and may fail
// to symlink the package from .bun cache. Fix all ai package instances.
const { existsSync, cpSync, readdirSync, mkdirSync, rmSync } = require("fs")
const { join } = require("path")

const root = join(__dirname, "..")
const vendorDist = join(root, "vendor", "dist")

if (!existsSync(vendorDist)) process.exit(0)

// Find all ai packages across the monorepo (root + workspace node_modules)
const aiDirs = []
function findAiDirs(base) {
  if (!existsSync(base)) return
  for (const entry of readdirSync(base)) {
    if (entry === "ai") {
      const p = join(base, entry)
      if (existsSync(join(p, "package.json"))) aiDirs.push(p)
    }
  }
}
findAiDirs(join(root, "node_modules"))
for (const pkg of readdirSync(join(root, "packages"))) {
  findAiDirs(join(root, "packages", pkg, "node_modules"))
}

// Also find in .bun cache and add to fix list
const bunCache = join(root, "node_modules", ".bun")
for (const entry of readdirSync(bunCache)) {
  if (!entry.startsWith("ai@")) continue
  const p = join(bunCache, entry, "node_modules", "ai")
  if (existsSync(join(p, "package.json")) && !aiDirs.includes(p)) aiDirs.push(p)
}

let fixed = 0
for (const aiDir of aiDirs) {
  const distIndex = join(aiDir, "dist", "index.js")
  if (existsSync(distIndex)) continue
  try {
    mkdirSync(join(aiDir, "dist"), { recursive: true })
    cpSync(vendorDist, join(aiDir, "dist"), { recursive: true, force: true })
    fixed++
  } catch {}
}

if (fixed > 0) console.log(`[arcana] fixed ai package in ${fixed} location(s)`)
