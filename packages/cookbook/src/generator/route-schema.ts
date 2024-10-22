import { Glob } from "bun";
import consola from "consola";
import { join } from "node:path";
import { exists } from "node:fs/promises";
import { exit, cwd } from "node:process";
import { checkPath } from "./utils";
import type { CookbookOptions } from "../utils/cookbook-dto-types";

export const routeSchema = async (options: CookbookOptions, paths: { cwd: string; milkio: string; generated: string }, project: CookbookOptions["projects"]["key"]) => {
  const scanner = join(paths.cwd);
  let files: AsyncIterableIterator<string> | Array<string> = [];
  if (await exists(scanner)) {
    const glob = new Glob("{app,call}/**/*.{action,stream}.ts");
    files = glob.scan({ cwd: scanner, onlyFiles: true });
  }

  let typescriptImports = `/* eslint-disable */\n// route-schema`;
  typescriptImports += `\nimport typia, { type IValidation } from "typia";`;
  let typescriptTypeExports = "export type MilkioRoutes = {";
  let typescriptRouteExports = "export const routes: any = new Map<string, any>([";
  let keys: Array<string> = [];

  for await (let path of files) {
    path = path.replaceAll("\\", "/");
    // const file = Bun.file(join(scanner, path));
    if (path.endsWith(".action.ts")) {
      // action
      checkPath(paths, path, "action");
      let nameWithPath = path.slice(0, path.length - 10); // 10 === ".action.ts".length
      let key = nameWithPath;
      if (key.endsWith("/index") || key === "index") key = key.slice(0, key.length - 5); // 5 === "index".length
      if (key === "app" && key.length > 1) key = key.slice(0, key.length - 1);
      if (keys.includes(key)) {
        consola.error(`Invalid path: "${join(paths.cwd, "app", path)}". The most common reason for having paths duplicate is that you created a new "${path}.ts" and have a "${path}/index.ts".\n`);
        exit(1);
      }
      key = key.split(".")[0];
      if (key.startsWith("app/")) key = key.slice(4);
      if (key.startsWith("call/")) key = `\$${key}`;
      if (key.endsWith("/")) key = key.slice(0, key.length - 1);
      keys.push(key);
      const name = path
        .slice(0, path.length - 10) // 10 === ".action.ts".length
        .replaceAll("/", "$")
        .replaceAll("#", "__")
        .replaceAll("-", "_");
      typescriptTypeExports += `\n  "/${key}": { `;
      typescriptRouteExports += `\n  ["/${key}", { `;
      typescriptRouteExports += `type: "action", `;
      if (project?.lazyRoutes === undefined || project?.lazyRoutes === true) {
        typescriptImports += `\nimport type ${name} from "../../../${nameWithPath}.action";`;
        typescriptRouteExports += `module: () => import("../../../${nameWithPath}.action"), `;
      } else {
        typescriptImports += `\nimport ${name} from "../../../${nameWithPath}.action";`;
        typescriptRouteExports += `module: () => ${name}, `;
      }
      typescriptRouteExports += `validateParams: (params: unknown): IValidation<Parameters<typeof ${name}["handler"]>[1]> => typia.misc.validatePrune<Parameters<typeof ${name}["handler"]>[1]>(params), `;
      typescriptRouteExports += `validateResults: (results: unknown): IValidation<Awaited<ReturnType<typeof ${name}["handler"]>>> => typia.misc.validatePrune<Awaited<ReturnType<typeof ${name}["handler"]>>>(results), `;
      typescriptRouteExports += `randomParams: (): IValidation<Parameters<typeof ${name}["handler"]>[1]> => typia.random<Parameters<typeof ${name}["handler"]>[1]>() as any, `;
      typescriptRouteExports += `}],`;
      typescriptTypeExports += `"🐣": boolean, `;
      typescriptTypeExports += `meta: typeof ${name}["meta"], `;
      typescriptTypeExports += `params: Parameters<typeof ${name}["handler"]>[1], `;
      typescriptTypeExports += `result: Awaited<ReturnType<typeof ${name}["handler"]>> `;
      typescriptTypeExports += `},`;
    } else if (path.endsWith(".stream.ts")) {
      // stream
      checkPath(paths, path, "stream");
      let nameWithPath = path.slice(0, path.length - 10); // 10 === ".stream.ts".length
      let key = nameWithPath;
      if (key.endsWith("/index") || key === "index") key = key.slice(0, key.length - 5); // 5 === "index".length
      if (key === "app" && key.length > 1) key = key.slice(0, key.length - 1);
      if (keys.includes(key)) {
        consola.error(`Invalid path: "${join(paths.cwd, "app", path)}". The most common reason for having paths duplicate is that you created a new "${path}.ts" and have a "${path}/index.ts".\n`);
        exit(1);
      }
      key = key.split(".")[0];
      if (key.startsWith("app/")) key = key.slice(4);
      if (key.startsWith("call/")) key = `\$${key}`;
      if (key.endsWith("/")) key = key.slice(0, key.length - 1);
      keys.push(key);
      const name = path
        .slice(0, path.length - 10) // 10 === ".stream.ts".length
        .replaceAll("/", "$")
        .replaceAll("#", "__")
        .replaceAll("-", "_");
      typescriptTypeExports += `\n  "/${key}": { `;
      typescriptRouteExports += `\n  ["/${key}", { `;
      typescriptRouteExports += `type: "stream", `;
      if (project?.lazyRoutes === undefined || project.lazyRoutes === true) {
        typescriptImports += `\nimport type ${name} from "../../../${nameWithPath}.stream";`;
        typescriptRouteExports += `module: () => import("../../../${nameWithPath}.stream"), `;
      } else {
        typescriptImports += `\nimport ${name} from "../../../${nameWithPath}.stream";`;
        typescriptRouteExports += `module: () => ${name}, `;
      }
      typescriptRouteExports += `validateParams: (params: unknown): IValidation<Parameters<typeof ${name}["handler"]>[1]> => typia.misc.validatePrune<Parameters<typeof ${name}["handler"]>[1]>(params), `;
      typescriptRouteExports += `validateResults: (results: unknown): IValidation<Awaited<ReturnType<typeof ${name}["handler"]>>> => typia.misc.validatePrune<Awaited<ReturnType<typeof ${name}["handler"]>>>(results), `;
      typescriptRouteExports += `randomParams: (): IValidation<Parameters<typeof ${name}["handler"]>[1]> => typia.random<Parameters<typeof ${name}["handler"]>[1]>() as any, `;
      typescriptRouteExports += `}],`;
      typescriptTypeExports += `"🐣": number, `;
      typescriptTypeExports += `meta: typeof ${name}["meta"], `;
      typescriptTypeExports += `params: Parameters<typeof ${name}["handler"]>[1], `;
      typescriptTypeExports += `result: Awaited<ReturnType<typeof ${name}["handler"]>> `;
      typescriptTypeExports += `},`;
    } else {
      continue;
    }
  }

  typescriptTypeExports += "\n}";
  typescriptRouteExports += "\n]);";
  const typescript = `${typescriptImports}\n\n${typescriptTypeExports}\n\n${typescriptRouteExports}`;
  await Bun.write(join(paths.cwd, ".milkio", "generated", "raw", "route-schema.ts"), typescript);
};
