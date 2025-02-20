import { $ } from "bun"
import type { CookbookActionParams } from "../utils/cookbook-dto-types"

export async function actionTemplate(params: CookbookActionParams) {
    if (params.type !== 'milkio@template') return false
    await $`bun run .templates/${params.template}.template.ts ${params.name} ${params.fsPath}`
}
