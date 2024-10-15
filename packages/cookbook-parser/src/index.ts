import { join } from "node:path";
import { existsSync } from "node:fs";
import { consola } from "consola";
import type { BunFile } from "bun";
import typia from "typia";
import { exit, cwd } from "node:process";
import { TSON } from "@southern-aurora/tson";

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

export type MilkioActionParams = {
  type: "milkio@logger";
  log: Array<any>;
};

export const useCookbookConfig = async () => {
  const options: CookbookOptions = await getOptions(Bun.file(join(cwd(), "cookbook.toml")));
  if (Object.keys(options.projects).length === 0) {
    consola.error(`For at least one project, check your "cookbook.toml".`);
    exit(0);
  }
  for (const projectName in options.projects) {
    const project = options.projects[projectName];
    if (!existsSync(join(cwd(), "projects", projectName, "package.json"))) {
      consola.error(`This project "${projectName}" does not exist (directory does not exist or there is no package.json), if the project has been deleted, please edit your "cookbook.toml" and delete [projects.${projectName}].`);
      exit(0);
    }
    const packageJsonRaw = await Bun.file(join(cwd(), "projects", projectName, "package.json"));
    const packageJson = await packageJsonRaw.json();
    if (project.type === "milkio" && packageJson.dependencies?.["milkio"] === undefined) {
      consola.error(`Project "${projectName}" does not have "milkio" in its dependencies. If this not a milkio project, modify the type in "cookbook.toml" to change it from "milkio" to "other".`);
      exit(0);
    }
  }
};

export const getOptions = async (milkioToml: BunFile) => {
  if (!(await milkioToml.exists())) {
    consola.error(`The "cookbook.toml" file does not exist in the current directory: ${join(cwd())}`);
    exit(0);
  }

  const options = Bun.TOML.parse(await milkioToml.text());

  const checkResult = typia.validateEquals<CookbookOptions>(options);
  if (!checkResult.success) {
    const error = checkResult.errors.at(0)!;
    consola.error(
      `The "cookbook.toml" format is incorrect, [${error.path.slice(7)}] should be ${error.expected}, but it is actually ${error.value}. You may be missing some properties in the configuration item, or adding some properties that will not be used. If you have extra properties, these properties are likely due to a misspelling.`,
    );
    exit(0);
  }
  return options as any;
};

export const getActionOptions = (options: string): any => {
  const results = TSON.parse(options);
  const checkResult = typia.misc.validatePrune<MilkioActionParams>(results);
  if (!checkResult.success) {
    throw checkResult.errors.at(0)!;
  }
  return results;
};
