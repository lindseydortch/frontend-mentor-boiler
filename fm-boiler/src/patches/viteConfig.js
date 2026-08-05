import fs from 'node:fs'
import path from 'node:path'

const IMPORT_MARKER = `import netlify from '@netlify/vite-plugin-tanstack-start'\n`
const IMPORT_INSERT = `${IMPORT_MARKER}\nimport path from 'node:path'\n`

const PLUGINS_MARKER = `  plugins: [devtools(), netlify(), tailwindcss(), tanstackStart(), viteReact()],\n`
const CSS_BLOCK = `  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, 'src')],
        additionalData: \`@use "styles/variables" as *;\\n\`,
      },
    },
  },
`
const PLUGINS_INSERT = `${PLUGINS_MARKER}${CSS_BLOCK}`

export function patchViteConfig(targetDir) {
  const file = path.join(targetDir, 'vite.config.ts')
  let source = fs.readFileSync(file, 'utf8')

  if (!source.includes(IMPORT_MARKER)) {
    throw new Error(
      `vite.config.ts patch failed: expected import line not found. The scaffolded file may have changed shape upstream.`,
    )
  }
  if (!source.includes(PLUGINS_MARKER)) {
    throw new Error(
      `vite.config.ts patch failed: expected plugins line not found. The scaffolded file may have changed shape upstream.`,
    )
  }

  source = source.replace(IMPORT_MARKER, IMPORT_INSERT)
  source = source.replace(PLUGINS_MARKER, PLUGINS_INSERT)

  fs.writeFileSync(file, source)
}
