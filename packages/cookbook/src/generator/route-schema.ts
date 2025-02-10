import { $, Glob } from 'bun'
import consola from 'consola'
import { join } from 'node:path'
import { exists, mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { exit } from 'node:process'
import type { CookbookOptions } from '../utils/cookbook-dto-types'
import { checkPath } from './utils'
import { calcHash } from '../utils/calc-hash'
import { progress } from '../progress'

export async function routeSchema(options: CookbookOptions, paths: { cwd: string, milkio: string, generated: string }, project: CookbookOptions['projects']['key']) {
  if (!paths.milkio) return
  const milkioRawPath = join(paths.cwd, '.milkio', 'raw')
  const milkioRawRoutesPath = join(milkioRawPath, 'routes')
  if (!(await exists(milkioRawPath))) await mkdir(milkioRawPath)
  if (!(await exists(milkioRawRoutesPath))) await mkdir(milkioRawRoutesPath)

  let typiaPath = join(paths.cwd, './node_modules/typia/lib/executable/typia.js')
  if (!(await exists(typiaPath))) typiaPath = join(paths.cwd, '../../node_modules/typia/lib/executable/typia.js')
  if (!(await exists(typiaPath))) {
    consola.error(`Typia is not installed, so it cannot be found in the following path: ${typiaPath}`)
    exit(1)
  }

  const scanner = join(paths.cwd, 'functions')
  if (!(await exists(scanner))) {
    consola.error(`The directory does not exist: ${scanner}`)
    exit(1)
  }
  // const glob = new Glob("{public,private}/**/*.{action,stream}.ts");
  const glob = new Glob('{public}/**/*.{action,stream}.ts')
  const filesAsyncGenerator = glob.scan({ cwd: scanner, onlyFiles: true })
  const files: Array<string> = []

  const tasks: Array<Promise<any>> = []
  let changeType: 'file-change' | 'file-create-or-delete' | null = null
  const hashes: Map<string, { importName: string, fileHash: string }> = new Map()
  for await (const fileRaw of filesAsyncGenerator) {
    const file = fileRaw.replaceAll('\\', '/')
    files.push(file)
    const runner = async () => {
      const fileHash = calcHash(await readFile(join(scanner, file)))

      const type = file.endsWith('.stream.ts') ? 'stream' : 'action'
      checkPath(paths, file, type)
      const importName = file
        .slice(0, file.length - 10) // 10 === ".ts".length
        .replaceAll('/', '__')
        .replaceAll('#', '__')
        .replaceAll('-', '_')
      const routeSchemaFolderPath = join(paths.cwd, '.milkio', 'raw', 'routes', `${importName}`)
      const routeGeneratedSchemaFolderPath = join(paths.cwd, '.milkio', 'generated', 'routes', `${importName}`)
      const routeSchemaPath = join(paths.cwd, '.milkio', 'raw', 'routes', `${importName}`, `${fileHash}.ts`)
      hashes.set(file, { importName, fileHash })
      if (!(await exists(routeSchemaFolderPath))) {
        await mkdir(routeSchemaFolderPath)
        changeType = 'file-create-or-delete'
      }
      if (!(await exists(routeSchemaPath))) {
        if (changeType !== 'file-create-or-delete') changeType = 'file-change'

        let routeFileImports = `/* eslint-disable */\n// route-schema`
        routeFileImports += `\nimport typia, { type IValidation } from "typia";`
        routeFileImports += `\nimport { TSON, type TSONEncode } from "@southern-aurora/tson";`
        let routeFileExports = 'export default { '
        routeFileExports += `type: "${type}", `
        routeFileExports += `types: undefined as any as { `
        routeFileExports += `"🐣": boolean, `
        routeFileExports += `meta: typeof ${importName}["meta"], `
        routeFileExports += `params: Parameters<typeof ${importName}["handler"]>[1], `
        routeFileExports += `result: Awaited<ReturnType<typeof ${importName}["handler"]>> `
        routeFileExports += `},`
        if (project?.lazyRoutes === undefined || project?.lazyRoutes === true) {
          routeFileImports += `\nimport type ${importName} from "../../../../functions/${file}";`
          routeFileExports += `module: () => import("../../../../functions/${file}"), `
        }
        else {
          routeFileImports += `\nimport ${importName} from "../../../../functions/${file}";`
          routeFileExports += `module: () => ${importName}, `
        }
        routeFileExports += `validateParams: (params: any): IValidation<Parameters<typeof ${importName}["handler"]>[1]> => typia.misc.validatePrune<Parameters<typeof ${importName}["handler"]>[1]>(params) as any, `
        routeFileExports += `randomParams: (): IValidation<Parameters<typeof ${importName}["handler"]>[1]> => typia.random<Parameters<typeof ${importName}["handler"]>[1]>() as any, `
        routeFileExports += `validateResults: (results: any): IValidation<Awaited<ReturnType<typeof ${importName}["handler"]>>> => typia.misc.validatePrune<Awaited<ReturnType<typeof ${importName}["handler"]>>>(results) as any, `
        routeFileExports += `resultsToJSON: (results: any): Awaited<ReturnType<typeof ${importName}["handler"]>> => typia.json.stringify<TSONEncode<Awaited<ReturnType<typeof ${importName}["handler"]>>>>(TSON.encode(results)) as any, `
        routeFileExports += `};`

        const oldFiles = await readdir(routeSchemaFolderPath)
        await writeFile(routeSchemaPath, `${routeFileImports}\n\n${routeFileExports}`)

        const deleteTasks: Array<Promise<any>> = []
        for (const oldFile of oldFiles) {
          deleteTasks.push(unlink(join(paths.cwd, '.milkio', 'raw', 'routes', `${importName}`, oldFile)))
          deleteTasks.push(unlink(join(paths.cwd, '.milkio', 'generated', 'routes', `${importName}`, oldFile)))
        }
        await Promise.all(deleteTasks)

        if (project?.typiaMode !== 'bundler') {
          try {
            await $`bun run --bun ${typiaPath} generate --input ${routeSchemaFolderPath} --output ${routeGeneratedSchemaFolderPath} --project ${join(paths.cwd, 'tsconfig.json')}`.cwd(join(paths.cwd)).quiet()
          }
          catch (error) {
            await $`node ${typiaPath} generate --input ${routeSchemaFolderPath} --output ${routeGeneratedSchemaFolderPath} --project ${join(paths.cwd, 'tsconfig.json')}`.cwd(join(paths.cwd)).quiet()
          }

          consola.info(`[${(progress.rate++ / 10).toFixed(1)}%] route schema generated: ${file}`)
        }
      }
    }
    tasks.push(runner())
  }
  await Promise.all(tasks)

  if (changeType) {
    const routeSchemaPath = join(paths.cwd, '.milkio', 'route-schema.ts')

    let routeSchemaFileImports = `/* eslint-disable */\n// route-schema`
    let routeSchemaFileExports = 'export default {'

    const routePaths: Array<string> = []
    for await (const file of files) {
      let { importName, fileHash } = hashes.get(file) ?? {}

      let routePath = file.slice(0, file.length - 10) // 10 === ".stream.ts".length && 10 === ".action.ts".length
      if (routePath.endsWith('/index') || routePath === 'index') routePath = routePath.slice(0, routePath.length - 5) // 5 === "index".length
      if (routePath === 'public' && routePath.length > 1) routePath = routePath.slice(0, routePath.length - 1)
      if (routePaths.includes(routePath)) {
        consola.error(`Invalid path: "${join(paths.cwd, 'public', file)}". The most common reason for having paths duplicate is that you created a new "${file}" and have a "${file}/index.ts".\n`)
        exit(1)
      }
      routePath = routePath.split('.')[0]
      if (routePath.startsWith('public/')) routePath = routePath.slice(7) // 7 === "public/".length
      if (routePath.startsWith('private/')) routePath = `__${routePath.slice(7)}`
      if (routePath !== '/' && routePath.endsWith('/')) routePath = routePath.slice(0, routePath.length - 1)
      routePaths.push(routePath)

      if (!importName) {
        importName = file
          .slice(0, file.length - 10) // 10 === ".ts".length
          .replaceAll('/', '__')
          .replaceAll('#', '__')
          .replaceAll('-', '_')
      }
      if (!fileHash) {
        try {
          fileHash = (await readdir(join(paths.cwd, '.milkio', 'raw', 'routes', `${importName}`)))[0].slice(0, -3) // 3 === ".ts".length
        }
        catch (error) {
          consola.error(`Generation failed, cache file is incomplete, please manually delete your ${join(paths.cwd, '.milkio')} directory and try again.`)
          exit(1)
        }
      }

      if (project?.typiaMode !== 'bundler') routeSchemaFileImports += `\nimport ${importName} from "./generated/routes/${importName}/${fileHash}.ts";`
      else routeSchemaFileImports += `\nimport ${importName} from "./raw/routes/${importName}/${fileHash}.ts";`
      routeSchemaFileExports += `\n  "/${routePath}": ${importName},`
    }
    routeSchemaFileExports += `\n};`

    await writeFile(routeSchemaPath, `${routeSchemaFileImports}\n\n${routeSchemaFileExports}`)

    consola.info(`[${(progress.rate++ / 10).toFixed(1)}%] route schema all generated.`)
  }
}
