import type { CookbookActionParams } from "../utils/cookbook-dto-types";
import { workers } from "../workers";

export async function actionWorkersList(params: CookbookActionParams) {
    if (params.type !== 'workers@list') return false
    return [...workers.keys()]
}
