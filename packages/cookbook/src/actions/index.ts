import { emitter } from "../emitter";
import type { CookbookActionParams } from "../utils/cookbook-dto-types";

export const actionHandler = async (options: CookbookActionParams): Promise<MilkioActionResultSuccess> => {
  if (options.type === "milkio@logger") {
    emitter.emit("data", {
      type: "milkio@logger",
      log: options.log,
    });
  }
  return {};
};

export type MilkioActionResultSuccess = {};
export type MilkioActionResultFail = { success: false };
