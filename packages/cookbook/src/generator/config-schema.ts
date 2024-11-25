import { env, Glob } from "bun";
import { join } from "node:path";
import { exists } from "node:fs/promises";
import type { CookbookOptions } from "../utils/cookbook-dto-types";

export const configSchema = async (options: CookbookOptions, paths: { cwd: string; milkio: string; generated: string }, project: CookbookOptions["projects"]["key"]) => {
  const mode = env.MODE ?? "development";
  const scanner = join(paths.cwd);
  let files: AsyncIterableIterator<string> | Array<string> = [];
  if (await exists(scanner)) {
    const glob = new Glob(`{config,configs,app}/**/{${mode},*.${mode}}.config.ts`);
    files = glob.scan({ cwd: scanner, onlyFiles: true });
  }

  let typescriptImports = `/* eslint-disable */\n// config-schema`;
  let typescriptExports = `const mode = "${mode}";`;
  typescriptExports += "\n\nexport const configSchema = { get: async () => {\n  return {";
  for await (let path of files) {
    path = path.replaceAll("\\", "/");
    let nameWithPath = path.slice(0, path.length - 10); // 10 === ".config.ts".length
    if (nameWithPath.endsWith("/index") || nameWithPath === "index") nameWithPath = nameWithPath.slice(0, nameWithPath.length - 5); // 5 === "index".length
    const name = path
      .slice(0, path.length - 10)
      .replaceAll("/", "$")
      .replaceAll("-", "_")
      .replaceAll(".config.ts", "")
      .split("/")
      .at(-1);
    typescriptImports += `\nimport ${name} from "../../${nameWithPath}.config";`;
    typescriptExports += `\n    ...(await ${name}(\n      // @ts-expect-error\n      mode\n    )),`;
  }
  typescriptExports += "\n  }\n}}";
  const typescript = `${typescriptImports}\n\n${typescriptExports}`;
  await Bun.write(join(paths.cwd, ".milkio", "generated", "config-schema.ts"), typescript);
};
