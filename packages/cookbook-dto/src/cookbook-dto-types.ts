export type CookbookOptions = {
  projects: Record<
    string,
    {
      type: "milkio" | "other";
      port: number;
      start: Array<string>;
      build: Array<string>;
      lazyRoutes?: boolean;
      typiaMode?: "generation" | "bundler";
      significant?: Array<string>;
      insignificant?: Array<string>;
    }
  >;
  general: {
    cookbookPort: number;
  };
};

export type CookbookActionParams = {
  type: "milkio@logger";
  log: Array<any>;
};

export type CookbookSubscribeEmits =
  | {
      type: "workers@stdout";
      key: string;
      chunk: string;
    }
  | {
      type: "workers@state";
      key: string;
      state: "running" | "stopped";
      code: number | null | "kill" | "running";
    }
  | {
      type: "watcher@change";
      event: "rename" | "change";
      path: string;
    }
  | {
      type: "milkio@logger";
      log: Array<any>;
    };
