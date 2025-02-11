import consola from 'consola'
import { join } from 'node:path'
import { cwd, exit } from 'node:process'
import { readFile } from 'node:fs/promises'

export async function buildUpgrade() {
  const packageJson = JSON.parse(await readFile(join(cwd(), 'package.json'), 'utf-8'))
  const lastMilkioVersion = packageJson?.dependencies?.milkio ?? packageJson?.peerDependencies?.milkio
  if (!lastMilkioVersion) {
    consola.error('Milkio is not installed in this project.')
    exit(0)
  }

  const result = await consola.prompt('Which version do you want to upgrade cookbook and milkio to?', {
    type: 'text',
    placeholder: lastMilkioVersion
  })

  if ("dependencies" in packageJson) {
    for (const key in packageJson.dependencies) {
      if (key === "milkio" || key.startsWith("@milkio/")) packageJson.dependencies[key] = result;
    }
  }

  if ("devDependencies" in packageJson) {
    for (const key in packageJson.devDependencies) {
      if (key === "milkio" || key.startsWith("@milkio/")) packageJson.devDependencies[key] = result;
    }
  }

  if ("peerDependencies" in packageJson) {
    for (const key in packageJson.peerDependencies) {
      if (key === "milkio" || key.startsWith("@milkio/")) packageJson.peerDependencies[key] = result;
    }
  }

  console.log('')
  console.log(`△ Milkio upgrade!`)
  console.log(`△ Run the installation command, such as: bun i`)
  console.log('')
}