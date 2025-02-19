import { it } from 'vitest'
import { astra } from '/test'

it.sequential('basic', async () => {
  const [context, reject, world] = await astra.createMirrorWorld(import.meta.url)
  const [error, results] = await world.execute('/_/calc', {
    params: {
      //
    },
    generateParams: true,
  })
  if (error)
    throw reject('Milkio did not execute successfully', error)

  // Check if the return value is as expected
  // ...
})
