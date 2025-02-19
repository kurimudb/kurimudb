import { action } from 'milkio'

export default action({
  async handler(
    context,
    params: {
      a: string
      b: number
      throw?: boolean
    },
  ) {
    const result = await context.call(import('../private/calc.action'), {
      a: params.a,
      b: params.b,
      throw: params.throw,
    })

    return result
  },
})
