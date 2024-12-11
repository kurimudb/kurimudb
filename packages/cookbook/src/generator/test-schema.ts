import { Glob } from "bun";
import consola from "consola";
import { join } from "node:path";
import { exists } from "node:fs/promises";
import { exit, cwd } from "node:process";
import type { CookbookOptions } from "../utils/cookbook-dto-types";
import { progress } from "../progress";

export const testSchema = async (options: CookbookOptions, paths: { cwd: string; milkio: string; generated: string }, project: CookbookOptions["projects"]["key"]) => {
  const scanner = join(paths.cwd);
  let files: AsyncIterableIterator<string> | Array<string> = [];
  if (await exists(scanner)) {
    const glob = new Glob("**/*.test.ts");
    files = glob.scan({ cwd: scanner, onlyFiles: true });
  }

  let typescriptImports = `/* eslint-disable */\n// test-schema`;
  let typescriptExports = "export default {";
  for await (let path of files) {
    path = path.replaceAll("\\", "/");
    let nameWithPath = path.slice(0, path.length - 8); // 8 === ".test.ts".length
    if (nameWithPath.endsWith("/index") || nameWithPath === "index") nameWithPath = nameWithPath.slice(0, nameWithPath.length - 5); // 5 === "index".length
    const name = path
      .slice(0, path.length - 8)
      .replaceAll("/", "__")
      .replaceAll("-", "_")
      .replaceAll(".test.ts", "");
    typescriptExports += `\n  "/${nameWithPath}": {},`;
  }
  typescriptExports += "\n}";
  const typescript = `${typescriptImports}\n\n${typescriptExports}`;
  await Bun.write(join(paths.cwd, ".milkio", "test-schema.ts"), typescript);

  consola.info(`[${(progress.rate / 10).toFixed(1)}%] test schema generated.`);
};
