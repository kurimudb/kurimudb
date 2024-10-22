import { Glob } from "bun";
import { join } from "node:path";
import { exists } from "node:fs/promises";
import type { CookbookOptions } from "../utils/cookbook-dto-types";

export const configSchema = async (options: CookbookOptions, paths: { cwd: string; milkio: string; generated: string }, project: CookbookOptions["projects"]["key"]) => {
  const scanner = join(paths.cwd);
  let files: AsyncIterableIterator<string> | Array<string> = [];
  if (await exists(scanner)) {
    const glob = new Glob("{config,app}/**/*.config.ts");
    files = glob.scan({ cwd: scanner, onlyFiles: true });
  }

  let typescriptImports = `/* eslint-disable */\n// config-schema`;
  let typescriptExports = "export default {";
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
    const namespace = path
      .slice(0, path.length - 10)
      // .replaceAll("/", "$")
      .replaceAll("-", "_")
      .replaceAll(".config.ts", "")
      .split("/")
      .at(-1);
    typescriptImports += `\nimport ${name} from "../../../${nameWithPath}.config";`;
    typescriptExports += `\n  "${namespace}": ${name},`;
  }
  typescriptExports += "\n}";
  const typescript = `${typescriptImports}\n\n${typescriptExports}`;
  await Bun.write(join(paths.cwd, ".milkio", "generated", "raw", "config-schema.ts"), typescript);
};
