import { Glob } from "bun";
import { join } from "node:path";
import { exists } from "node:fs/promises";
import { checkPath } from "./utils";
import type { CookbookOptions } from "../utils/cookbook-dto-types";
import consola from "consola";
import { progress } from "../progress";

export const commandSchema = async (options: CookbookOptions, paths: { cwd: string; milkio: string; generated: string }, project: CookbookOptions["projects"]["key"]) => {
  const scanner = join(paths.cwd, "command");
  let files: AsyncIterableIterator<string> | Array<string> = [];
  if (await exists(scanner)) {
    const glob = new Glob("*.ts");
    files = glob.scan({ cwd: scanner, onlyFiles: true });
  }

  let typescriptImports = `/* eslint-disable */\n// command-schema`;
  let typescriptExports = "export default {";
  typescriptExports += "\n  commands: {";
  let len = 0;
  for await (let path of files) {
    path = path.replaceAll("\\", "/");
    const file = Bun.file(join(scanner, path));
    const fileUnit8Array = await file.text();
    if (!fileUnit8Array.includes("export default command({")) continue;
    checkPath(paths, path);

    const nameWithPath = path.slice(0, path.length - 3); // 3 === ".ts".length
    const name = nameWithPath.replaceAll("/", "__").replaceAll("-", "_");
    typescriptImports += `\nimport ${name} from "../command/${nameWithPath}";`;
    typescriptExports += `\n    "${nameWithPath}": { module: ${name} },`;
    ++len;
  }
  typescriptExports += "\n  },";
  typescriptExports += `\n  len: ${len}`;
  typescriptExports += "\n}";
  const typescript = `${typescriptImports}\n\n${typescriptExports}`;
  await Bun.write(join(paths.cwd, ".milkio", "command-schema.ts"), typescript);

  consola.info(`[${(progress.rate++ / 10).toFixed(1)}%] command schema generated.`);
};
