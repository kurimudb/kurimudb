import type { CookbookActionParams } from '../utils/cookbook-dto-types'
import { actionPing } from './ping'
import { actionLogger } from './logger'
import { actionTemplate } from './template'
import { actionWorkersList } from './workers-list'
import { actionWorkersGet } from './workers-get'

const actions = [
  actionPing,
  actionLogger,
  actionTemplate,
  actionWorkersList,
  actionWorkersGet
]

export async function actionHandler(options: CookbookActionParams) {
  if (!options || !options.type) throw `Invalid cookbook command, please upgrade the version of cookbook.`
  for (const action of actions) {
    const result = await action(options)
    if (result === false) continue
    return result
  }
  throw `Unknown cookbook command, please upgrade the version of cookbook.`
}
