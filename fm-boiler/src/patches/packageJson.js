import fs from 'node:fs'
import path from 'node:path'

export function patchPackageJson(targetDir) {
  const file = path.join(targetDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'))

  const dependencies = { ...pkg.dependencies, 'sass-embedded': 'latest' }
  pkg.dependencies = Object.fromEntries(
    Object.entries(dependencies).sort(([a], [b]) => a.localeCompare(b)),
  )

  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n')
}
