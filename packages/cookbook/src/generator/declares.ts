import {  Glob } from 'bun'
import { join } from 'node:path'
import type { CookbookOptions } from '../utils/cookbook-dto-types'

export async function declares(options: CookbookOptions, paths: { cwd: string, milkio: string, generated: string }, project: CookbookOptions['projects']['key']) {
    let declaresImports = '// declares'
    declaresImports += `\nimport { generated } from "./index";`
    declaresImports += `\nimport { configSchema } from "./config-schema";`

    let declaresFile = `declare module "milkio" {`
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
    declaresFile += `\n  interface $context`
    let contextIndex = 0
    for await (const path of contextDts) {
        declaresImports+= `\nimport type { _ as context_${contextIndex} } from "../${path.replaceAll('\\', '/')}";`
        if (contextIndex > 0) declaresFile += `, `
        else declaresFile += ` extends `
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
    declaresFile += `\n  interface $event`
    let eventIndex = 0
    for await (const path of eventDts) {
        declaresImports+= `\nimport type { _ as event_${eventIndex} } from "../${path.replaceAll('\\', '/')}";`
        if (eventIndex > 0) declaresFile += `, `
        else declaresFile += ` extends `
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
    declaresFile += `\n  interface $rejectCode`
    let codeIndex = 0
    for await (const path of codeDts) {
        declaresImports+= `\nimport type { _ as code_${codeIndex} } from "../${path.replaceAll('\\', '/')}";`
        if (codeIndex > 0) declaresFile += `, `
        else declaresFile += ` extends `
        declaresFile += `code_${codeIndex}`
        ++codeIndex;
    }
    declaresFile += ` {}`

    declaresFile += `\n}`
    await Bun.write(join(paths.milkio, 'declares.d.ts'), `${declaresImports}\n\n${declaresFile}`)
}