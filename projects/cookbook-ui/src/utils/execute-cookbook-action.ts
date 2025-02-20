
import { cookbook } from "../modules/cookbook";
import type { CookbookActionParams } from "./cookbook-dto-types";
import { fetchWithTimeout } from "./fetch-with-timeout";
import { TSON } from "@southern-aurora/tson";

export async function executeCookbookAction<T = any>(params: CookbookActionParams): Promise<{ success: true, data: T }> {
    try {
        const response = await fetchWithTimeout((import.meta.env.PROD === true ? location.origin : 'http://localhost:8000') + '/$action', {
            method: 'POST',
            body: TSON.stringify(params),
            timeout: 500,
        })
        if (!response.ok) {
            cookbook.linked = false;
            throw new Error('Unable to connect to cookbook');
        }
        const result = TSON.parse(await response.text());
        if (result.success !== true) {
            cookbook.linked = false;
            throw new Error('Failed to execute cookbook action');
        }
        cookbook.linked = true;
        return result;
    } catch (error) {
        cookbook.linked = false;
        throw new Error('Failed to execute cookbook action');
    }
}