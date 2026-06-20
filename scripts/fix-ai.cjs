// Bun on Windows fails to create the node_modules/ai symlink
// AND fails to extract dist/ from the tarball. Two bugs, one fix:
// 1. Copy the full ai package from .bun cache to node_modules/ai
// 2. Overlay pre-extracted dist from vendor/
const { existsSync, cpSync, rmSync, readdirSync, mkdirSync } = require("fs")
const { join } = require("path")

const root = join(__dirname, "..")
const nmDir = join(root, "node_modules")
const aiLink = join(nmDir, "ai")
const vendorDist = join(root, "vendor", "dist")
const distIndex = join(aiLink, "dist", "index.js")

if (existsSync(distIndex)) process.exit(0)

// Find ai in .bun cache
const bunCache = join(nmDir, ".bun")
let aiCache = null
for (const entry of readdirSync(bunCache)) {
  if (entry.startsWith("ai@")) {
    const p = join(bunCache, entry, "node_modules", "ai")
    if (existsSync(join(p, "package.json"))) { aiCache = p; break }
  }
}

if (!aiCache) process.exit(0)

console.log("[arcana] fixing ai package (bun Windows workaround)...")

// Copy the full package from bun cache
try { rmSync(aiLink, { recursive: true, force: true }) } catch {}
mkdirSync(aiLink, { recursive: true })
cpSync(aiCache, aiLink, { recursive: true, force: true })

// Overlay dist from vendor
if (existsSync(vendorDist)) {
  mkdirSync(join(aiLink, "dist"), { recursive: true })
  cpSync(vendorDist, join(aiLink, "dist"), { recursive: true, force: true })
}

console.log("[arcana] ai package fixed")
