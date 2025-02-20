import type { CookbookActionParams } from "../utils/cookbook-dto-types";
import { workers } from "../workers";

export async function actionWorkersGet(params: CookbookActionParams) {
    if (params.type !== 'workers@get') return false
    const worker = workers.get(params.key)
    if (!worker) throw `Worker ${params.key} not found`

    return worker.stdout.slice(params.index)
}
