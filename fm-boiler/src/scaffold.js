import { execFileSync } from 'node:child_process'

export function runTanstackScaffold(projectName, targetDir) {
  execFileSync(
    'npx',
    [
      '@tanstack/cli@latest',
      'create',
      projectName,
      '--framework',
      'react',
      '--no-examples',
      '--add-ons',
      'eslint,netlify',
      '--package-manager',
      'npm',
      '--no-install',
      '--git',
      '--intent',
      '--non-interactive',
      '--target-dir',
      targetDir,
    ],
    { stdio: 'inherit' },
  )
}
