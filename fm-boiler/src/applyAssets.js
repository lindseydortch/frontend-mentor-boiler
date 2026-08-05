import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { renderTemplate } from './templating.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.join(__dirname, '..', 'assets')

const STALE_FILES = ['src/styles.css']

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

export function copyNewFiles(targetDir) {
  copyDir(path.join(ASSETS_DIR, 'new'), targetDir)
}

export function removeStaleFiles(targetDir) {
  for (const relativePath of STALE_FILES) {
    fs.rmSync(path.join(targetDir, relativePath), { force: true })
  }
}

export function writeReadme(targetDir, tokens) {
  const templatePath = path.join(ASSETS_DIR, 'templates', 'README.md')
  const template = fs.readFileSync(templatePath, 'utf8')
  const rendered = renderTemplate(template, tokens)
  fs.writeFileSync(path.join(targetDir, 'README.md'), rendered)
}
