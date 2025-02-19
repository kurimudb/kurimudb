import { $, Glob } from 'bun'
import consola from 'consola'
import { join } from 'node:path'
import { exists, mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { exit } from 'node:process'
import type { CookbookOptions } from '../utils/cookbook-dto-types'
import { checkPath, toSafeImportName } from './utils'
import { calcHash } from '../utils/calc-hash'
import { progress } from '../progress'

export async function declares(options: CookbookOptions, paths: { cwd: string, milkio: string, generated: string }, project: CookbookOptions['projects']['key']) {
    let declaresImports = '// declares'
    declaresImports += `\nimport { generated } from "./index";`
    declaresImports += `\nimport { configSchema } from "./config-schema";`

    let declaresFile = `declare module 'milkio' {`
    declaresFile += `\n  interface $types {`
    declaresFile += `\n    generated: typeof generated`
    declaresFile += `\n    configSchema: typeof configSchema`
    declaresFile += `\n  }`
    
    /**
     * ------------------------------------------------------------------------------------------------
     * @step context
     * ------------------------------------------------------------------------------------------------
     */
    const contextDts = (new Glob(`{contexts}/**/{*.d.ts`)).scan({ cwd: join(paths.cwd), onlyFiles: true })
    declaresFile += `\n  interface $context extends `
    let contextIndex = 0
    for await (const path of contextDts) {
        declaresImports+= `\nimport type { _ as context_${contextIndex} } from "../${path.replaceAll('\\', '/')}";`
        if (contextIndex > 0) declaresFile += `, `
        declaresFile += `context_${contextIndex}`
        ++contextIndex;
    }
    declaresFile += ` {}`
    
    /**
     * ------------------------------------------------------------------------------------------------
     * @step event
     * ------------------------------------------------------------------------------------------------
     */
    const eventDts = (new Glob(`{events}/**/{*.d.ts`)).scan({ cwd: join(paths.cwd), onlyFiles: true })
    declaresFile += `\n  interface $event extends `
    let eventIndex = 0
    for await (const path of eventDts) {
        declaresImports+= `\nimport type { _ as event_${eventIndex} } from "../${path.replaceAll('\\', '/')}";`
        if (eventIndex > 0) declaresFile += `, `
        declaresFile += `event_${eventIndex}`
        ++eventIndex;
    }
    declaresFile += ` {}`
    
    /**
     * ------------------------------------------------------------------------------------------------
     * @step code
     * ------------------------------------------------------------------------------------------------
     */
    const codeDts = (new Glob(`{codes}/**/{*.d.ts`)).scan({ cwd: join(paths.cwd), onlyFiles: true })
    declaresFile += `\n  interface $rejectCode extends `
    let codeIndex = 0
    for await (const path of codeDts) {
        declaresImports+= `\nimport type { _ as code_${codeIndex} } from "../${path.replaceAll('\\', '/')}";`
        if (codeIndex > 0) declaresFile += `, `
        declaresFile += `code_${codeIndex}`
        ++codeIndex;
    }
    declaresFile += ` {}`

    declaresFile += `\n}`
    await Bun.write(join(paths.milkio, 'declares.ts'), `${declaresImports}\n\n${declaresFile}`)
}