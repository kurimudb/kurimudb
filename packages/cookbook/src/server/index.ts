import { consola } from 'consola'
import { join } from 'node:path'
import type { BunFile } from 'bun'
import { actionHandler } from '../actions'
import { TSON } from '@southern-aurora/tson'
import { emitter } from '../emitter'
import type { CookbookOptions } from '@milkio/cookbook/src/utils/cookbook-dto-types'
import { checkCookbookActionParams } from '@milkio/cookbook/src/utils/cookbook-dto-checks'

export async function initServer(options: CookbookOptions) {
  Bun.serve({
    port: options.general.cookbookPort,
    async fetch(request) {
      const url = new URL(request.url)
      switch (url.pathname) {
        case '/$action': {
          try {
            const [error, options] = await checkCookbookActionParams(TSON.parse(await request.text()))
            if (error) throw error
            const result = await actionHandler(options)
            return new Response(TSON.stringify(result))
          }
          catch (error: any) {
            consola.error(error)
            return new Response(`${error?.message ?? error}`, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }, status: 500 })
          }
        }
        case '/$subscribe': {
          let control: ReadableStreamDirectController
          const messages: Array<string> = []
          const handler = (data: any) => {
            messages.push(`data:${TSON.stringify(data)}\n\n`)
          }
          emitter.on('data', handler)
          let closed = false
          const stream = new ReadableStream({
            type: 'direct',
            async pull(controller: ReadableStreamDirectController) {
              control = controller
              while (!closed) {
                const message = messages.shift()
                if (!message) await Bun.sleep(20)
                else controller.write(message)
              }
            },
            cancel() {
              emitter.off('data', handler)
              control.close()
              closed = true
            },
          })
          return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
        }
        default: {
          const assets = join(import.meta.dirname, 'website')
          const response = { body: '' as any, headers: { 'Cache-Control': 'no-store' } as Record<string, string> }
          let file: BunFile | string = Bun.file(join(assets, url.pathname))

          if (await file.exists()) {
            response.headers['Content-Type'] = file.type
          }
          else {
            file = Bun.file(join(assets, url.pathname, 'index.html'))
            // if (!(await file.exists())) file = "404 Not Found ~ UwU";
            if (!(await file.exists())) file = 'Cookbook in development ~ UwU'
          }

          return new Response(file, response)
        }
      }
    },
  })
}
