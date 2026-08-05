import fs from 'node:fs'
import path from 'node:path'

const WORKBENCH_COLOR_CUSTOMIZATIONS = {
  'titleBar.activeForeground': '#ffffff',
  'titleBar.inactiveForeground': '#ffffffCC',
  'titleBar.activeBackground': '#15263f',
  'titleBar.inactiveBackground': '#15263fCC',
}

export function patchVscodeSettings(targetDir) {
  const file = path.join(targetDir, '.vscode', 'settings.json')
  const settings = JSON.parse(fs.readFileSync(file, 'utf8'))

  settings['workbench.colorCustomizations'] = {
    ...settings['workbench.colorCustomizations'],
    ...WORKBENCH_COLOR_CUSTOMIZATIONS,
  }

  fs.writeFileSync(file, JSON.stringify(settings, null, 2) + '\n')
}
