import fs from 'node:fs'
import path from 'node:path'

const CSS_IMPORT_MARKER = `import appCss from '../styles.css?url'\n`
const CSS_IMPORT_REPLACEMENT = `import appCss from '../styles/globals.scss?url'\n`

const TITLE_MARKER = `      {
        title: 'TanStack Start Starter',
      },
`

const LINKS_MARKER = `      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
`
const LINKS_INSERT = `      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: \`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌲</text></svg>\`,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
      },
    ],
`

export function patchRootRoute(targetDir, { projectTitle }) {
  const file = path.join(targetDir, 'src/routes/__root.tsx')
  let source = fs.readFileSync(file, 'utf8')

  for (const [name, marker] of [
    ['css import', CSS_IMPORT_MARKER],
    ['title meta', TITLE_MARKER],
    ['links array', LINKS_MARKER],
  ]) {
    if (!source.includes(marker)) {
      throw new Error(
        `__root.tsx patch failed: expected ${name} not found. The scaffolded file may have changed shape upstream.`,
      )
    }
  }

  const titleReplacement = `      {
        title: 'Frontend Mentor | ${projectTitle}',
        description: 'A frontendmentor.io challenge',
      },
`

  source = source.replace(CSS_IMPORT_MARKER, CSS_IMPORT_REPLACEMENT)
  source = source.replace(TITLE_MARKER, titleReplacement)
  source = source.replace(LINKS_MARKER, LINKS_INSERT)

  fs.writeFileSync(file, source)
}
