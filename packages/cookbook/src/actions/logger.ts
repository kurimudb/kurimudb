import type { CookbookActionParams } from "../utils/cookbook-dto-types";
import { emitter } from '../emitter'

export async function actionLogger(params: CookbookActionParams) {
    if (params.type !== 'milkio@logger') return false
    emitter.emit('data', {
      type: 'milkio@logger',
      log: params.log,
    })
}
