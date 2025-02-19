import { createWorld, reject } from 'milkio'
import { generated } from './.milkio'
import { configSchema } from './.milkio/config-schema'

declare module 'milkio' {
  interface $types {
    generated: typeof generated
    configSchema: typeof configSchema
  }
  interface $context {
    say(): string
  }
}

export async function create() {
  const world = await createWorld(generated, configSchema, {
    port: 9000,
    cookbook: { cookbookPort: 8000 },
    // develop: env.MILKIO_DEVELOP === "ENABLE",
    // argv: process.argv,
    develop: true,
    argv: [],
  })

  return world
}

export type World = Awaited<ReturnType<typeof create>>
