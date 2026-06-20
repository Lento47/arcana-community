// Workaround for bun Windows tarball extraction bug:
// bun install fails to extract dist/ from ai@6.0.168.
// npm extracts correctly, so we use npm to fix it.
const { existsSync, mkdirSync, rmSync } = require("fs")
const { execSync } = require("child_process")
const { join } = require("path")

const aiDir = join(__dirname, "..", "node_modules", "ai")
const distIndex = join(aiDir, "dist", "index.js")

if (existsSync(distIndex)) process.exit(0)

console.log("[arcana] fixing ai package (bun extraction workaround)...")
const tmp = join(__dirname, "..", "node_modules", ".ai-fix")
mkdirSync(tmp, { recursive: true })

try {
  execSync(`npm pack ai@6.0.168 --pack-destination "${tmp}"`, {
    stdio: "pipe",
    cwd: join(__dirname, ".."),
  })
  mkdirSync(aiDir, { recursive: true })
  execSync(`tar -xzf "${tmp}/ai-6.0.168.tgz" --strip-components=2 -C "${aiDir}" package/dist`, {
    stdio: "pipe",
  })
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
console.log("[arcana] ai package fixed")
