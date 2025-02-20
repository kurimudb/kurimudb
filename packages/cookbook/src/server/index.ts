import { consola } from 'consola'
import { join } from 'node:path'
import type { BunFile } from 'bun'
import { actionHandler } from '../actions'
import { TSON } from '@southern-aurora/tson'
import type { CookbookOptions } from '../utils/cookbook-dto-types'
import { checkCookbookActionParams } from '../utils/cookbook-dto-checks'
import { exists } from 'node:fs/promises'
import { cwd } from 'node:process'

export async function initServer(options: CookbookOptions) {
  Bun.serve({
    hostname: '::1',
    port: options.general.cookbookPort,
    async fetch(request) {
      const url = new URL(request.url)
      switch (url.pathname) {
        case '/$action': {
          let headers: Record<string, string> = { 'Content-Type': 'application/json' }
          // This may be a bit of a hack, the purpose is to only allow cross-domain in the process of developing cookbooks
          if (await exists(join(cwd(), 'packages', 'cookbook', 'cookbook.ts'))) headers = { ...headers, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' }
          try {
            const [error, options] = await checkCookbookActionParams(TSON.parse(await request.text()))
            if (error) throw error
            const result = await actionHandler(options)
            return new Response(TSON.stringify({ success: true, data: result }), { headers, status: 200})
          }
          catch (error: any) {
            consola.error(error)
            return new Response(TSON.stringify({ success: false, cause: `${error?.message ?? error}` }), { headers, status: 500 })
          }
        }
        default: {
          const assets = join(import.meta.dirname, '..', 'website')
          const response = { body: '' as any, headers: { 'Cache-Control': 'no-store' } as Record<string, string> }
          let file: BunFile | string = Bun.file(join(assets, url.pathname))

          if (await file.exists()) {
            response.headers['Content-Type'] = file.type
          }
          else {
            file = Bun.file(join(assets, url.pathname, 'index.html'))
            if (!(await file.exists())) file = "404 Not Found ~ UwU";
          }

          return new Response(file, response)
        }
      }
    },
  })
}
