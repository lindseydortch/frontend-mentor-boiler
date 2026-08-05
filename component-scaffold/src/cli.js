import fs from 'node:fs'
import path from 'node:path'

import { cancel, isCancel, select, text } from '@clack/prompts'

function parseArgs(argv) {
  let name = null
  let dir = null
  let extension = null

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dir') {
      dir = argv[++i]
    } else if (arg === '--tsx') {
      extension = 'tsx'
    } else if (arg === '--jsx') {
      extension = 'jsx'
    } else if (!name) {
      name = arg
    }
  }

  if (!name) {
    console.error(
      'Usage: component <ComponentName> [--dir <path>] [--tsx|--jsx]\n' +
        '(omit --dir or --tsx/--jsx to be prompted)',
    )
    process.exit(1)
  }

  return { name, dir, extension }
}

async function promptExtension() {
  const answer = await select({
    message: 'Create as .tsx or .jsx?',
    options: [
      { value: 'tsx', label: '.tsx' },
      { value: 'jsx', label: '.jsx' },
    ],
  })

  if (isCancel(answer)) {
    cancel('Cancelled.')
    process.exit(1)
  }

  return answer
}

async function promptDir() {
  const answer = await text({
    message: 'Where should this component be created?',
    placeholder: 'src/components',
    defaultValue: 'src/components',
  })

  if (isCancel(answer)) {
    cancel('Cancelled.')
    process.exit(1)
  }

  return answer
}

function componentSource(componentName, scssModuleName) {
  return `import styles from './${scssModuleName}.module.scss'

function ${componentName}() {
  return <div className={styles.${scssModuleName}}>${componentName}</div>
}

export default ${componentName}
`
}

function scssSource(scssModuleName) {
  return `.${scssModuleName} {
}
`
}

export async function main(argv = process.argv.slice(2)) {
  const { name, dir: dirArg, extension: extensionArg } = parseArgs(argv)
  const extension = extensionArg ?? (await promptExtension())
  const dir = dirArg ?? (await promptDir())

  const scssModuleName = name.charAt(0).toLowerCase() + name.slice(1)
  const componentDir = path.resolve(process.cwd(), dir, name)

  fs.mkdirSync(componentDir, { recursive: true })

  const componentFile = path.join(componentDir, `${name}.${extension}`)
  const scssFile = path.join(componentDir, `${scssModuleName}.module.scss`)

  if (fs.existsSync(componentFile) || fs.existsSync(scssFile)) {
    console.error(`Refusing to overwrite existing files in ${componentDir}`)
    process.exit(1)
  }

  fs.writeFileSync(componentFile, componentSource(name, scssModuleName))
  fs.writeFileSync(scssFile, scssSource(scssModuleName))

  console.log(`Created ${path.relative(process.cwd(), componentFile)}`)
  console.log(`Created ${path.relative(process.cwd(), scssFile)}`)
}
