import { copyFileSync, rmSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

const sourceDir = './dist'
const targetDir = '/home/nitro/Downloads/Packages/AndroidApp/Chelongar/app/src/main/assets'

let copiedFiles = 0

function copyRecursive(src, dest) {
  try {
    const stats = statSync(src)

    if (stats.isDirectory()) {
      console.log("📁 Directory:", src)

      mkdirSync(dest, { recursive: true })

      const files = readdirSync(src)

      for (const file of files) {
        const srcPath = join(src, file)
        const destPath = join(dest, file)

        copyRecursive(srcPath, destPath)
      }

    } else {
      console.log("📄 Copy:", src, "->", dest)

      copyFileSync(src, dest)
      copiedFiles++
    }

  } catch (err) {
    console.error("❌ Error copying:", src)
    console.error(err)
  }
}

try {

  if (!existsSync(sourceDir)) {
    console.error("❌ Source directory does not exist:", sourceDir)
    process.exit(1)
  }

  console.log("🚀 Starting copy...")
  console.log("Source:", sourceDir)
  console.log("Target:", targetDir)

  try {
    rmSync(targetDir, { recursive: true, force: true })
    console.log("🗑️ Old assets removed")
  } catch (err) {
    console.error("⚠️ Could not remove old assets:", err)
  }

  copyRecursive(sourceDir, targetDir)

  console.log("✅ Copy finished")
  console.log("📦 Files copied:", copiedFiles)

  if (copiedFiles === 0) {
    console.warn("⚠️ No files were copied! Check source directory.")
  }

} catch (err) {
  console.error("💥 Fatal error:")
  console.error(err)
  process.exit(1)
}
