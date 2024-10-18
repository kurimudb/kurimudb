/**
* The content of this file is automatically generated by Typia.
* It can be edited in the /packages/cookbook-dto/src/* file, and each time you run bun run dev, the generated file will be synced to another location based on the content of the /develop.ts.
*/

export type CookbookOptions = {
    projects: Record<string, {
        type: "milkio" | "other";
        port: number;
        start: Array<string>;
        build: Array<string>;
        lazyRoutes?: boolean;
        typiaMode?: "generation" | "bundler";
        significant?: Array<string>;
        insignificant?: Array<string>;
    }>;
    general: {
        start: string;
        cookbookPort: number;
    };
};
export type CookbookActionParams = {
    type: "milkio@logger";
    log: Array<any>;
} | {
    type: "milkio@template";
    name: string;
    template: string;
};
export type CookbookSubscribeEmits = {
    type: "workers@stdout";
    key: string;
    chunk: string;
} | {
    type: "workers@state";
    key: string;
    state: "running" | "stopped";
    code: number | null | "kill" | "running";
} | {
    type: "watcher@change";
    event: "rename" | "change";
    path: string;
} | {
    type: "milkio@logger";
    log: Array<any>;
};
