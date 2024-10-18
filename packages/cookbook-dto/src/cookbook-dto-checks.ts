import typia from "typia";
import type { CookbookActionParams, CookbookOptions, CookbookSubscribeEmits } from "./cookbook-dto-types";

export const checkCookbookOptions = async (cookbookTomlParsed: any): Promise<[Record<any, any> & { message: string; stack: string }, null] | [null, CookbookOptions]> => {
  let cookbookToml = { ...cookbookTomlParsed };
  const checkResult = typia.validateEquals<CookbookOptions>(cookbookTomlParsed);
  let error = null;
  if (!checkResult.success) {
    const error: any = checkResult.errors.at(0)!;
    error.message = `The "cookbook.toml" format is incorrect, [${error.path.slice(7)}] should be ${error.expected}, but it is actually ${error.value}. You may be missing some properties in the configuration item, or adding some properties that will not be used. If you have extra properties, these properties are likely due to a misspelling.`;
    Error.captureStackTrace(error);
    cookbookTomlParsed = null;
  }
  return [error, cookbookToml];
};

export const checkCookbookActionParams = async (resultsRaw: any): Promise<[Record<any, any> & { message: string; stack: string }, null] | [null, CookbookActionParams]> => {
  let results = { ...resultsRaw };
  if (typeof Bun === "undefined") throw new Error("Bun is not defined");
  const checkResult = typia.misc.validatePrune<CookbookActionParams>(resultsRaw);
  let error = null;
  if (!checkResult.success) {
    const error: any = checkResult.errors.at(0)!;
    error.message = `The "cookbook.toml" format is incorrect, [${error.path.slice(7)}] should be ${error.expected}, but it is actually ${error.value}. You may be missing some properties in the configuration item, or adding some properties that will not be used. If you have extra properties, these properties are likely due to a misspelling.`;
    Error.captureStackTrace(error);
    results = null;
  }
  return [error, results];
};

export const checkCookbookSubscribeEmits = async (results: any): Promise<[Record<any, any> & { message: string; stack: string }, null] | [null, CookbookSubscribeEmits]> => {
  const typia = await import("typia");
  const checkResult = typia.misc.validatePrune<CookbookSubscribeEmits>(results);
  let error = null;
  if (!checkResult.success) {
    const error: any = checkResult.errors.at(0)!;
    error.message = `The "cookbook.toml" format is incorrect, [${error.path.slice(7)}] should be ${error.expected}, but it is actually ${error.value}. You may be missing some properties in the configuration item, or adding some properties that will not be used. If you have extra properties, these properties are likely due to a misspelling.`;
    Error.captureStackTrace(error);
    results = null;
  }
  return [error, results];
};
