import { execFileSync } from 'node:child_process'
import path from 'node:path'

import { copyNewFiles, removeStaleFiles, writeReadme } from './applyAssets.js'
import { patchPackageJson } from './patches/packageJson.js'
import { patchViteConfig } from './patches/viteConfig.js'
import { patchRootRoute } from './patches/rootRoute.js'
import { patchVscodeSettings } from './patches/vscodeSettings.js'
import { runTanstackScaffold } from './scaffold.js'
import { githubAnchor, toTitleCase } from './templating.js'

function parseArgs(argv) {
  const [projectName, ...rest] = argv
  if (!projectName || projectName.startsWith('-')) {
    console.error('Usage: fm-boiler <project-name> [--slug <challenge-slug>]')
    process.exit(1)
  }

  let challengeSlug = projectName
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--slug') {
      challengeSlug = rest[i + 1]
      i++
    }
  }

  return { projectName, challengeSlug }
}

export function main(argv = process.argv.slice(2)) {
  const { projectName, challengeSlug } = parseArgs(argv)
  const targetDir = path.resolve(process.cwd(), projectName)
  const projectTitle = toTitleCase(projectName)

  console.log(`\nScaffolding TanStack Start app...\n`)
  runTanstackScaffold(projectName, targetDir)

  console.log(`\nApplying fm-boiler conventions...`)
  copyNewFiles(targetDir)
  removeStaleFiles(targetDir)
  patchPackageJson(targetDir)
  patchViteConfig(targetDir)
  patchRootRoute(targetDir, { projectTitle })
  patchVscodeSettings(targetDir)
  writeReadme(targetDir, {
    PROJECT_NAME: projectTitle,
    PROJECT_NAME_ANCHOR: githubAnchor(`Frontend Mentor - ${projectTitle} solution`),
    CHALLENGE_SLUG: challengeSlug,
  })

  console.log(`\nInstalling dependencies...\n`)
  execFileSync('npm', ['install'], { cwd: targetDir, stdio: 'inherit' })

  console.log(`\nDone! Your challenge is ready:\n`)
  console.log(`  cd ${projectName}`)
  console.log(`  npm run dev\n`)
}
