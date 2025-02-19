import { join } from 'node:path'
import { cwd } from 'node:process'
import { exists, mkdir } from 'node:fs/promises'
import { routeSchema } from './route-schema'
import { commandSchema } from './command-schema'
import { $ } from 'bun'
import type { CookbookOptions } from '../utils/cookbook-dto-types'
import { configSchema } from './config-schema'
import { checkPort } from '../utils/check-port'
import killPort from 'kill-port'
import { handlerSchema } from './handler-schema'
import { declares } from './declares'

let firstGenerate = true

export const generator = {
  async significant(options: CookbookOptions) {
    const tasks: Array<Promise<void>> = []
    for (const projectName in options.projects) {
      const project = options.projects[projectName]
      if (project.watch || firstGenerate) {
        if (!(await checkPort(project.port))) {
          try {
            await killPort(project.port)
          }
          catch (error) {}
        }
      }
      if (project.type !== 'milkio') continue
      const handler = async () => {
        const paths = {
          cwd: join(cwd(), 'projects', projectName),
          milkio: join(cwd(), 'projects', projectName, '.milkio'),
          milkioRaw: join(cwd(), 'projects', projectName, '.milkio', 'raw'),
          generated: join(cwd(), 'projects', projectName, '.milkio', 'generated'),
        }
        if (!(await exists(paths.milkio))) await mkdir(paths.milkio)
          if (!(await exists(paths.milkioRaw))) await mkdir(paths.milkioRaw)
        if (!(await exists(paths.generated))) await mkdir(paths.generated)

        await (async () => {
          let indexFile = '// index'
          indexFile += `\nimport "./declares.ts";`
          indexFile += `\nimport routeSchema from "./route-schema.ts";`
          indexFile += `\nimport commandSchema from "./command-schema.ts";`
          indexFile += `\nimport handlerSchema from "./handler-schema.ts";`
          indexFile += `\nimport type { $rejectCode } from "milkio";`
          indexFile += '\n'
          indexFile += '\nexport const generated = {'
          indexFile += '\n  rejectCode: undefined as unknown as $rejectCode,'
          indexFile += '\n  routeSchema,'
          indexFile += '\n  commandSchema,'
          indexFile += '\n  handlerSchema,'
          indexFile += '\n};'
          await Bun.write(join(paths.milkio, 'index.ts'), indexFile)
        })()

        await Promise.all([
          // UwU
          routeSchema(options, paths, project),
          commandSchema(options, paths, project),
          configSchema(options, paths, project),
          handlerSchema(options, paths, project),
        ])
        await declares(options, paths, project)
        if (project?.significant && project.significant.length > 0) {
          for (const script of project.significant) {
            await $`${{ raw: script }}`.cwd(join(paths.cwd))
          }
        }
      }
      tasks.push(handler())
    }
    await Promise.all(tasks)
    firstGenerate = false
  },
  async insignificant(options: CookbookOptions) {
    const tasks: Array<Promise<void>> = []
    for (const projectName in options.projects) {
      const project = options.projects[projectName]
      if (project.type !== 'milkio') continue
      const handler = async () => {
        const paths = {
          cwd: join(cwd(), 'projects', projectName),
          milkio: join(cwd(), 'projects', projectName, '.milkio'),
          generated: join(cwd(), 'projects', projectName, '.milkio'),
        }
        if (project?.insignificant && project.insignificant.length > 0) {
          for (const script of project.insignificant) {
            await $`${{ raw: script }}`.cwd(paths.cwd)
          }
        }
      }
      tasks.push(handler())
    }
    await Promise.all(tasks)
  },
}
