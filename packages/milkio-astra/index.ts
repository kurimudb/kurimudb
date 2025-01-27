import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { cwd } from "node:process";
import { load } from "js-toml";
import { TSON } from "@southern-aurora/tson";
import { format } from "date-fns";
import type { CookbookOptions } from "./utils/cookbook-dto-types";

export type AstraOptionsInit = {
  stargate: { $types: any; execute: any; ping: any; cookbook: any };
  bootstrap: () => Promise<Record<string, any>>;
};

type GeneratorGeneric<T> = T extends AsyncGenerator<infer I> ? I : never;

type Mixin<T, U> = U & Omit<T, keyof U>;

type ExecuteOptions = {
  headers?: Record<string, string>;
  timeout?: number;
  type?: "action" | "stream";
};

type ExecuteResultsOption = { executeId: string };

type Context = {
  logger: Logger;
};

type Logger = {
  debug: (description: string, ...params: Array<unknown>) => Log;
  info: (description: string, ...params: Array<unknown>) => Log;
  warn: (description: string, ...params: Array<unknown>) => Log;
  error: (description: string, ...params: Array<unknown>) => Log;
  response: (description: string, ...params: Array<unknown>) => Log;
};

type Log = [string /* executeId */, "[DEBUG]" | "[INFO]" | "[WARN]" | "[ERROR]" | "[RESPONSE]", string, string, ...Array<unknown>];

type Reject = (description: string, ...params: Array<unknown>) => Error;

export const createAstra = async <AstraOptions extends AstraOptionsInit, Generated extends AstraOptions["stargate"]["$types"]["generated"]>(astraOptions: AstraOptions) => {
  if (!existsSync(join(cwd(), "cookbook.toml"))) throw new Error(`The "cookbook.toml" file does not exist in the current directory. If you are running the test with the VS Code extension, make sure it exists in the root directory of the folder you are opening with VS Code.`);
  let cookbookOptions = load((await readFile(join(cwd(), "cookbook.toml"))).toString()) as CookbookOptions;
  // wait for all milkio projects to start and can be accessed
  // the reason why stargate's ping method is not used directly is that even if only one project is tested, it is necessary to wait for all milkio projects to start
  await Promise.all([
    ...(() => {
      const projectStatus = new Map<string, { promise: Promise<undefined>; resolve: (value?: undefined | PromiseLike<undefined>) => void; reject: (reason?: any) => void }>();
      for (const projectName in cookbookOptions.projects) {
        const project = cookbookOptions.projects[projectName];
        if (project.type !== "milkio") continue;
        projectStatus.set(projectName, withResolvers());
        let counter = 256;
        let timer: Timer | null = setInterval(async () => {
          if (--counter <= 0) {
            clearInterval(timer!);
            timer = null;
            console.warn(`[cookbook] Your project ${projectName} (http://localhost:${project.port}/) HTTP server hasn't started for too long.`);
            projectStatus.get(projectName)!.resolve(undefined);
            return;
          }
          try {
            const response = await fetchWithTimeout(`http://localhost:${project.port}/generate_204`, { method: "HEAD", timeout: 1024 });
            if (response.status === 204) {
              if (timer) clearTimeout(timer);
              timer = null;
              return projectStatus.get(projectName)!.resolve(undefined);
            }
          } catch (error) {}
        }, 100);
      }
      return Array.from(projectStatus.values()).map((v) => v.promise);
    })(),
  ]);

  type Execute = <Path extends keyof Generated["routeSchema"]>(
    path: Path,
    options?: Mixin<
      ExecuteOptions,
      | {
          params?: Generated["routeSchema"][Path]["types"]["params"];
        }
      | {
          params?: Partial<Generated["routeSchema"][Path]["types"]["params"]>;
          generateParams: true;
        }
    >,
  ) => Promise<
    Generated["routeSchema"][Path]["types"]["🐣"] extends boolean
      ? // action
        [Partial<Generated["rejectCode"]>, null, ExecuteResultsOption] | [null, Generated["routeSchema"][Path]["types"]["result"], ExecuteResultsOption]
      : // stream
        [Partial<Generated["rejectCode"]>, null, ExecuteResultsOption] | [null, AsyncGenerator<[Partial<Generated["rejectCode"]>, null] | [null, GeneratorGeneric<Generated["routeSchema"][Path]["types"]["result"]>], ExecuteResultsOption>]
  >;

  type MirrorWorld = Mixin<
    Awaited<ReturnType<AstraOptions["bootstrap"]>>,
    {
      paths: { cwd: string; milkio: string; generated: string };
      execute: Execute;
    }
  >;

  return {
    options: astraOptions,
    async createMirrorWorld(importMetaUrl: string): Promise<[Context, Reject, MirrorWorld]> {
      const thisFilePath = join(fileURLToPath(importMetaUrl));
      const thisFileDirPath = join(dirname(thisFilePath)).replaceAll("\\", "/");
      const thisFileDirPathArr = thisFileDirPath.split("/");
      let projectName: string = "";

      await (async () => {
        let isProjectsDirectory = false;
        for (let i = 0; i < thisFileDirPathArr.length; i++) {
          if (thisFileDirPathArr[i] === "projects") {
            isProjectsDirectory = true;
            continue;
          }
          if (isProjectsDirectory === false) continue;
          projectName = thisFileDirPathArr[i];
          break;
        }
        if (projectName === "") throw new Error("Unable to determine the path of the current test, make sure the test is under a milkio project.");
        let projectNameChecked = false;
        for (const projectNameForCookbookOptions in cookbookOptions.projects) {
          if (projectNameForCookbookOptions === projectName) {
            projectNameChecked = true;
            break;
          }
        }
        if (projectNameChecked === false) throw new Error(`Project name "${projectName}" not found in "cookbook.toml" in "projects.${projectName}".`);
      })();

      const paths = {
        cwd: join(cwd(), "projects", projectName),
        milkio: join(cwd(), "projects", projectName, ".milkio"),
        generated: join(cwd(), "projects", projectName, ".milkio"),
      };

      const execute = async (path: Parameters<MirrorWorld["execute"]>[0], optionsInit?: Parameters<MirrorWorld["execute"]>[1]) => {
        let options = (optionsInit as any) ?? {};
        if (options?.generateParams === true) {
          if (!options?.params) options.params = {};
          options.params.$milkioGenerateParams = "enable";
        }

        const results = await this.options.stargate.cookbook.subscribe(`http://localhost:${cookbookOptions.general.cookbookPort}`);
        void (async () => {
          for await (const result of results) {
            if (result.type !== "milkio@logger") continue;
            console.log("\n[MILKIO]", ...(result.log ?? []));
          }
        })();

        const response = await this.options.stargate.execute(path, options);

        await new Promise((resolve) => setTimeout(resolve, 40));
        context.logger.response(path as string, `\nerror - ${TSON.stringify(response[0])}`, `\nresult - ${typeof response[1]?.next === "function" ? "AsyncGenerator" : TSON.stringify(response[1])}`);

        return response;
      };

      const getNow = () => format(new Date(), "(yyyy-MM-dd hh:mm:ss)");
      const onLoggerInserting = (log: Log) => {
        log = [...log];
        log[0] = `\n${log[0]}` as any;
        console.log(...log);
        return true;
      };

      const context = {
        logger: {
          debug: (description: string, ...params: Array<unknown>): Log => {
            const log: Log = ["[TEST]", "[DEBUG]", description, getNow(), ...params];
            onLoggerInserting(log);
            return log;
          },
          info: (description: string, ...params: Array<unknown>): Log => {
            const log: Log = ["[TEST]", "[INFO]", description, getNow(), ...params];
            onLoggerInserting(log);
            return log;
          },
          warn: (description: string, ...params: Array<unknown>): Log => {
            const log: Log = ["[TEST]", "[WARN]", description, getNow(), ...params];
            onLoggerInserting(log);
            return log;
          },
          error: (description: string, ...params: Array<unknown>): Log => {
            const log: Log = ["[TEST]", "[ERROR]", description, getNow(), ...params];
            onLoggerInserting(log);
            return log;
          },
          response: (path: string, ...params: Array<unknown>): Log => {
            const log: Log = ["[TEST]", "[RESPONSE]", path, getNow(), ...params];
            onLoggerInserting(log);
            return log;
          },
        },
      } as Context;

      const world = {
        ...(await astraOptions.bootstrap()),
        paths,
        execute,
      } as any;

      const reject = (...params: Array<unknown>): Error => {
        const output: Array<any> = [
          "[REJECT]",
          ...params.map((param) => {
            try {
              const result = TSON.stringify(param);
              return result;
            } catch (error) {
              return error?.toString?.() ?? typeof error;
            }
          }),
        ];
        console.log(...output);
        for (let index = 1; index < output.length; index++) {
          if (typeof output[index] === "object") {
            output[index] = output[index].toString();
          }
        }
        const message = output.join(" ");
        return new Error(message);
      };

      return [context, reject, world];
    },
  };
};

export async function fetchWithTimeout(url: string, options: FetchRequestInit & { timeout?: number } = {}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

function withResolvers<T = any>(): PromiseWithResolvers<T> {
  let resolve: PromiseWithResolvers<T>["resolve"];
  let reject: PromiseWithResolvers<T>["reject"];
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve: resolve!, reject: reject! };
}
