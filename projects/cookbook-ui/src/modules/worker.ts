import { reactive } from "vue";
import { executeCookbookAction } from "../utils/execute-cookbook-action";

export const worker = reactive({
    workers: ([]),
    stdout: ({} as Record<string, { chunks: string[], index: number }>),
})

export const workerActions = {
    async refreshWorkers() {
        const result = await executeCookbookAction({ type: 'workers@list' });
        worker.workers = result.data;
    },

    async pullStdout() {
        const tasks = new Array<any>()
        for (const key of worker.workers) {
            tasks.push((async () => {
                if (!worker.stdout?.[key]) worker.stdout[key] = {
                    chunks: [],
                    index: 0,
                }
                const result = await executeCookbookAction({ type: 'workers@get', key, index: worker.stdout[key].index });
                if (result.data && result.data.length > 0) {
                    worker.stdout[key].chunks.push(...result.data);
                    worker.stdout[key].index = worker.stdout[key].chunks.length - 1;
                }
            })());
        }
        await Promise.all(tasks);
    }
}