import { $ } from "bun";
import { emitter } from "../emitter";
import type { CookbookActionParams } from "../utils/cookbook-dto-types";

export const actionHandler = async (options: CookbookActionParams) => {
  if (!options || !options.type) throw `Invalid cookbook command, please upgrade the version of cookbook.`;
  else if (options.type === "milkio@logger") {
    emitter.emit("data", {
      type: "milkio@logger",
      log: options.log,
    });
  } else if (options.type === "milkio@template") {
    await $`bun run .templates/${options.template}.template.ts ${options.name}`;
  } else throw `Unknown cookbook command, please upgrade the version of cookbook.`;
};
