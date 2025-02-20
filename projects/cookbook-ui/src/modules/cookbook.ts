import { reactive, watch } from "vue";
import { executeCookbookAction } from "../utils/execute-cookbook-action";
import { workerActions } from "./worker";

export const cookbook = reactive({
    linked: (false),
})

export const cookbookActions = {
    async bootstrap() {
        let timer: number | undefined;
        let workerTimer: number | undefined;
        const ping = async () => {
            await executeCookbookAction({ type: 'milkio@ping' })
            clearInterval(timer)
        }
        watch(() => cookbook.linked, async (linked) => {
            if (linked === false) {
                clearInterval(workerTimer)
                timer = setInterval(ping, 1000)
            } else {
                await workerActions.refreshWorkers();
                workerTimer = setInterval(async () => {
                    await workerActions.pullStdout();
                }, 500);
            }
        })
        try {
            await ping()
        } catch (error) {
            timer = setInterval(ping, 1000)
        }
    }
}