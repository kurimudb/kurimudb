/**
 * The content of this file is automatically generated by Typia.
 * It can be edited in the /packages/cookbook-dto/src/* file, and each time you run bun run dev, the generated file will be synced to another location based on the content of the /develop.ts.
 */

import typia from "typia";
import type { CookbookActionParams, CookbookOptions, CookbookSubscribeEmits } from "./cookbook-dto-types";
export const checkCookbookOptions = async (
  cookbookTomlParsed: any,
): Promise<
  | [
      Record<any, any> & {
        message: string;
        stack: string;
      },
      null,
    ]
  | [null, CookbookOptions]
> => {
  const checkResult = (() => {
    const $join = (typia.validateEquals as any).join;
    const $io0 = (input: any, _exceptionable: boolean = true): boolean =>
      "object" === typeof input.projects &&
      null !== input.projects &&
      false === Array.isArray(input.projects) &&
      $io1(input.projects, true && _exceptionable) &&
      "object" === typeof input.general && null !== input.general &&
      $io3(input.general, true && _exceptionable) &&
      (2 === Object.keys(input).length ||
        Object.keys(input).every((key: any) => {
          if (["projects", "general"].some((prop: any) => key === prop)) return true;
          const value = input[key];
          if (undefined === value) return true;
          return false;
        }));
    const $io1 = (input: any, _exceptionable: boolean = true): boolean =>
      Object.keys(input).every((key: any) => {
        const value = input[key];
        if (undefined === value) return true;
        return "object" === typeof value && null !== value && $io2(value, true && _exceptionable);
      });
    const $io2 = (input: any, _exceptionable: boolean = true): boolean =>
      ("milkio" === input.type || "other" === input.type) &&
      "number" === typeof input.port &&
      Array.isArray(input.start) &&
      input.start.every((elem: any, _index1: number) => "string" === typeof elem) &&
      Array.isArray(input.build) &&
      input.build.every((elem: any, _index2: number) => "string" === typeof elem) &&
      (undefined === input.lazyRoutes || "boolean" === typeof input.lazyRoutes) &&
      (undefined === input.typiaMode || "generation" === input.typiaMode || "bundler" === input.typiaMode) &&
      (undefined === input.significant || (Array.isArray(input.significant) && input.significant.every((elem: any, _index3: number) => "string" === typeof elem))) &&
      (undefined === input.insignificant || (Array.isArray(input.insignificant) && input.insignificant.every((elem: any, _index4: number) => "string" === typeof elem))) &&
      (4 === Object.keys(input).length ||
        Object.keys(input).every((key: any) => {
          if (["type", "port", "start", "build", "lazyRoutes", "typiaMode", "significant", "insignificant"].some((prop: any) => key === prop)) return true;
          const value = input[key];
          if (undefined === value) return true;
          return false;
        }));
    const $io3 = (input: any, _exceptionable: boolean = true): boolean =>
      "number" === typeof input.cookbookPort &&
      (1 === Object.keys(input).length ||
        Object.keys(input).every((key: any) => {
          if (["cookbookPort"].some((prop: any) => key === prop)) return true;
          const value = input[key];
          if (undefined === value) return true;
          return false;
        }));
    const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
      [
        ((("object" === typeof input.projects && null !== input.projects && false === Array.isArray(input.projects)) ||
          $report(_exceptionable, {
            path: _path + ".projects",
            expected: "Record<string, __type>",
            value: input.projects,
          })) &&
          $vo1(input.projects, _path + ".projects", true && _exceptionable)) ||
          $report(_exceptionable, {
            path: _path + ".projects",
            expected: "Record<string, __type>",
            value: input.projects,
          }),
        ((("object" === typeof input.general && null !== input.general) ||
          $report(_exceptionable, {
            path: _path + ".general",
            expected: "__type.o1",
            value: input.general,
          })) &&
          $vo3(input.general, _path + ".general", true && _exceptionable)) ||
          $report(_exceptionable, {
            path: _path + ".general",
            expected: "__type.o1",
            value: input.general,
          }),
        2 === Object.keys(input).length ||
          false === _exceptionable ||
          Object.keys(input)
            .map((key: any) => {
              if (["projects", "general"].some((prop: any) => key === prop)) return true;
              const value = input[key];
              if (undefined === value) return true;
              return $report(_exceptionable, {
                path: _path + $join(key),
                expected: "undefined",
                value: value,
              });
            })
            .every((flag: boolean) => flag),
      ].every((flag: boolean) => flag);
    const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
      [
        false === _exceptionable ||
          Object.keys(input)
            .map((key: any) => {
              const value = input[key];
              if (undefined === value) return true;
              return (
                ((("object" === typeof value && null !== value) ||
                  $report(_exceptionable, {
                    path: _path + $join(key),
                    expected: "__type",
                    value: value,
                  })) &&
                  $vo2(value, _path + $join(key), true && _exceptionable)) ||
                $report(_exceptionable, {
                  path: _path + $join(key),
                  expected: "__type",
                  value: value,
                })
              );
            })
            .every((flag: boolean) => flag),
      ].every((flag: boolean) => flag);
    const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
      [
        "milkio" === input.type ||
          "other" === input.type ||
          $report(_exceptionable, {
            path: _path + ".type",
            expected: '("milkio" | "other")',
            value: input.type,
          }),
        "number" === typeof input.port ||
          $report(_exceptionable, {
            path: _path + ".port",
            expected: "number",
            value: input.port,
          }),
        ((Array.isArray(input.start) ||
          $report(_exceptionable, {
            path: _path + ".start",
            expected: "Array<string>",
            value: input.start,
          })) &&
          input.start
            .map(
              (elem: any, _index5: number) =>
                "string" === typeof elem ||
                $report(_exceptionable, {
                  path: _path + ".start[" + _index5 + "]",
                  expected: "string",
                  value: elem,
                }),
            )
            .every((flag: boolean) => flag)) ||
          $report(_exceptionable, {
            path: _path + ".start",
            expected: "Array<string>",
            value: input.start,
          }),
        ((Array.isArray(input.build) ||
          $report(_exceptionable, {
            path: _path + ".build",
            expected: "Array<string>",
            value: input.build,
          })) &&
          input.build
            .map(
              (elem: any, _index6: number) =>
                "string" === typeof elem ||
                $report(_exceptionable, {
                  path: _path + ".build[" + _index6 + "]",
                  expected: "string",
                  value: elem,
                }),
            )
            .every((flag: boolean) => flag)) ||
          $report(_exceptionable, {
            path: _path + ".build",
            expected: "Array<string>",
            value: input.build,
          }),
        undefined === input.lazyRoutes ||
          "boolean" === typeof input.lazyRoutes ||
          $report(_exceptionable, {
            path: _path + ".lazyRoutes",
            expected: "(boolean | undefined)",
            value: input.lazyRoutes,
          }),
        undefined === input.typiaMode ||
          "generation" === input.typiaMode ||
          "bundler" === input.typiaMode ||
          $report(_exceptionable, {
            path: _path + ".typiaMode",
            expected: '("bundler" | "generation" | undefined)',
            value: input.typiaMode,
          }),
        undefined === input.significant ||
          ((Array.isArray(input.significant) ||
            $report(_exceptionable, {
              path: _path + ".significant",
              expected: "(Array<string> | undefined)",
              value: input.significant,
            })) &&
            input.significant
              .map(
                (elem: any, _index7: number) =>
                  "string" === typeof elem ||
                  $report(_exceptionable, {
                    path: _path + ".significant[" + _index7 + "]",
                    expected: "string",
                    value: elem,
                  }),
              )
              .every((flag: boolean) => flag)) ||
          $report(_exceptionable, {
            path: _path + ".significant",
            expected: "(Array<string> | undefined)",
            value: input.significant,
          }),
        undefined === input.insignificant ||
          ((Array.isArray(input.insignificant) ||
            $report(_exceptionable, {
              path: _path + ".insignificant",
              expected: "(Array<string> | undefined)",
              value: input.insignificant,
            })) &&
            input.insignificant
              .map(
                (elem: any, _index8: number) =>
                  "string" === typeof elem ||
                  $report(_exceptionable, {
                    path: _path + ".insignificant[" + _index8 + "]",
                    expected: "string",
                    value: elem,
                  }),
              )
              .every((flag: boolean) => flag)) ||
          $report(_exceptionable, {
            path: _path + ".insignificant",
            expected: "(Array<string> | undefined)",
            value: input.insignificant,
          }),
        4 === Object.keys(input).length ||
          false === _exceptionable ||
          Object.keys(input)
            .map((key: any) => {
              if (["type", "port", "start", "build", "lazyRoutes", "typiaMode", "significant", "insignificant"].some((prop: any) => key === prop)) return true;
              const value = input[key];
              if (undefined === value) return true;
              return $report(_exceptionable, {
                path: _path + $join(key),
                expected: "undefined",
                value: value,
              });
            })
            .every((flag: boolean) => flag),
      ].every((flag: boolean) => flag);
    const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
      [
        "number" === typeof input.cookbookPort ||
          $report(_exceptionable, {
            path: _path + ".cookbookPort",
            expected: "number",
            value: input.cookbookPort,
          }),
        1 === Object.keys(input).length ||
          false === _exceptionable ||
          Object.keys(input)
            .map((key: any) => {
              if (["cookbookPort"].some((prop: any) => key === prop)) return true;
              const value = input[key];
              if (undefined === value) return true;
              return $report(_exceptionable, {
                path: _path + $join(key),
                expected: "undefined",
                value: value,
              });
            })
            .every((flag: boolean) => flag),
      ].every((flag: boolean) => flag);
    const __is = (input: any, _exceptionable: boolean = true): input is CookbookOptions => "object" === typeof input && null !== input && $io0(input, true);
    let errors: any;
    let $report: any;
    return (input: any): typia.IValidation<CookbookOptions> => {
      if (false === __is(input)) {
        errors = [];
        $report = (typia.validateEquals as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) =>
          ((("object" === typeof input && null !== input) ||
            $report(true, {
              path: _path + "",
              expected: "CookbookOptions",
              value: input,
            })) &&
            $vo0(input, _path + "", true)) ||
          $report(true, {
            path: _path + "",
            expected: "CookbookOptions",
            value: input,
          }))(input, "$input", true);
        const success = 0 === errors.length;
        return {
          success,
          errors,
          data: success ? input : undefined,
        } as any;
      }
      return {
        success: true,
        errors: [],
        data: input,
      } as any;
    };
  })()(cookbookTomlParsed);
  let error = null;
  if (!checkResult.success) {
    const error: any = checkResult.errors.at(0)!;
    error.message = `The "cookbook.toml" format is incorrect, [${error.path.slice(7)}] should be ${error.expected}, but it is actually ${error.value}. You may be missing some properties in the configuration item, or adding some properties that will not be used. If you have extra properties, these properties are likely due to a misspelling.`;
    Error.captureStackTrace(error);
    cookbookTomlParsed = null;
  }
  return [error, cookbookTomlParsed];
};
export const checkCookbookActionParams = async (
  results: any,
): Promise<
  | [
      Record<any, any> & {
        message: string;
        stack: string;
      },
      null,
    ]
  | [null, CookbookActionParams]
> => {
  if (typeof Bun === "undefined") throw new Error("Bun is not defined");
  const checkResult = (() => {
    const $io0 = (input: any): boolean => "milkio@logger" === input.type && Array.isArray(input.log);
    const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
      [
        "milkio@logger" === input.type ||
          $report(_exceptionable, {
            path: _path + ".type",
            expected: '"milkio@logger"',
            value: input.type,
          }),
        Array.isArray(input.log) ||
          $report(_exceptionable, {
            path: _path + ".log",
            expected: "Array<any>",
            value: input.log,
          }),
      ].every((flag: boolean) => flag);
    const $po0 = (input: any): any => {
      for (const key of Object.keys(input)) {
        if ("type" === key || "log" === key) continue;
        delete input[key];
      }
    };
    const __is = (input: any): input is CookbookActionParams => "object" === typeof input && null !== input && $io0(input);
    let errors: any;
    let $report: any;
    const __validate = (input: any): typia.IValidation<CookbookActionParams> => {
      if (false === __is(input)) {
        errors = [];
        $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) =>
          ((("object" === typeof input && null !== input) ||
            $report(true, {
              path: _path + "",
              expected: "CookbookActionParams",
              value: input,
            })) &&
            $vo0(input, _path + "", true)) ||
          $report(true, {
            path: _path + "",
            expected: "CookbookActionParams",
            value: input,
          }))(input, "$input", true);
        const success = 0 === errors.length;
        return {
          success,
          errors,
          data: success ? input : undefined,
        } as any;
      }
      return {
        success: true,
        errors: [],
        data: input,
      } as any;
    };
    const __prune = (input: CookbookActionParams): void => {
      if ("object" === typeof input && null !== input) $po0(input);
    };
    return (input: any): typia.IValidation<CookbookActionParams> => {
      const result = __validate(input);
      if (result.success) __prune(input);
      return result;
    };
  })()(results);
  let error = null;
  if (!checkResult.success) {
    const error: any = checkResult.errors.at(0)!;
    error.message = `The "cookbook.toml" format is incorrect, [${error.path.slice(7)}] should be ${error.expected}, but it is actually ${error.value}. You may be missing some properties in the configuration item, or adding some properties that will not be used. If you have extra properties, these properties are likely due to a misspelling.`;
    Error.captureStackTrace(error);
    results = null;
  }
  return [error, results];
};
export const checkCookbookSubscribeEmits = async (
  results: any,
): Promise<
  | [
      Record<any, any> & {
        message: string;
        stack: string;
      },
      null,
    ]
  | [null, CookbookSubscribeEmits]
> => {
  const typia = await import("typia");
  const checkResult = (() => {
    const $throws = (typia.misc.validatePrune as any).throws;
    const $io0 = (input: any): boolean => "workers@stdout" === input.type && "string" === typeof input.key && "string" === typeof input.chunk;
    const $io1 = (input: any): boolean => "workers@state" === input.type && "string" === typeof input.key && ("running" === input.state || "stopped" === input.state) && (null === input.code || "running" === input.code || "kill" === input.code || "number" === typeof input.code);
    const $io2 = (input: any): boolean => "watcher@change" === input.type && ("rename" === input.event || "change" === input.event) && "string" === typeof input.path;
    const $io3 = (input: any): boolean => "milkio@logger" === input.type && Array.isArray(input.log);
    const $iu0 = (input: any): any =>
      (() => {
        if ("workers@stdout" === input.type) return $io0(input);
        else if ("workers@state" === input.type) return $io1(input);
        else if ("watcher@change" === input.type) return $io2(input);
        else if ("milkio@logger" === input.type) return $io3(input);
        else return false;
      })();
    const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
      [
        "workers@stdout" === input.type ||
          $report(_exceptionable, {
            path: _path + ".type",
            expected: '"workers@stdout"',
            value: input.type,
          }),
        "string" === typeof input.key ||
          $report(_exceptionable, {
            path: _path + ".key",
            expected: "string",
            value: input.key,
          }),
        "string" === typeof input.chunk ||
          $report(_exceptionable, {
            path: _path + ".chunk",
            expected: "string",
            value: input.chunk,
          }),
      ].every((flag: boolean) => flag);
    const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
      [
        "workers@state" === input.type ||
          $report(_exceptionable, {
            path: _path + ".type",
            expected: '"workers@state"',
            value: input.type,
          }),
        "string" === typeof input.key ||
          $report(_exceptionable, {
            path: _path + ".key",
            expected: "string",
            value: input.key,
          }),
        "running" === input.state ||
          "stopped" === input.state ||
          $report(_exceptionable, {
            path: _path + ".state",
            expected: '("running" | "stopped")',
            value: input.state,
          }),
        null === input.code ||
          "running" === input.code ||
          "kill" === input.code ||
          "number" === typeof input.code ||
          $report(_exceptionable, {
            path: _path + ".code",
            expected: '("kill" | "running" | null | number)',
            value: input.code,
          }),
      ].every((flag: boolean) => flag);
    const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
      [
        "watcher@change" === input.type ||
          $report(_exceptionable, {
            path: _path + ".type",
            expected: '"watcher@change"',
            value: input.type,
          }),
        "rename" === input.event ||
          "change" === input.event ||
          $report(_exceptionable, {
            path: _path + ".event",
            expected: '("change" | "rename")',
            value: input.event,
          }),
        "string" === typeof input.path ||
          $report(_exceptionable, {
            path: _path + ".path",
            expected: "string",
            value: input.path,
          }),
      ].every((flag: boolean) => flag);
    const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean =>
      [
        "milkio@logger" === input.type ||
          $report(_exceptionable, {
            path: _path + ".type",
            expected: '"milkio@logger"',
            value: input.type,
          }),
        Array.isArray(input.log) ||
          $report(_exceptionable, {
            path: _path + ".log",
            expected: "Array<any>",
            value: input.log,
          }),
      ].every((flag: boolean) => flag);
    const $vu0 = (input: any, _path: string, _exceptionable: boolean = true): any =>
      (() => {
        if ("workers@stdout" === input.type) return $vo0(input, _path, true && _exceptionable);
        else if ("workers@state" === input.type) return $vo1(input, _path, true && _exceptionable);
        else if ("watcher@change" === input.type) return $vo2(input, _path, true && _exceptionable);
        else if ("milkio@logger" === input.type) return $vo3(input, _path, true && _exceptionable);
        else
          return $report(_exceptionable, {
            path: _path,
            expected: "(__type | __type.o1 | __type.o2 | __type.o3)",
            value: input,
          });
      })();
    const $po0 = (input: any): any => {
      for (const key of Object.keys(input)) {
        if ("type" === key || "key" === key || "chunk" === key) continue;
        delete input[key];
      }
    };
    const $po1 = (input: any): any => {
      for (const key of Object.keys(input)) {
        if ("type" === key || "key" === key || "state" === key || "code" === key) continue;
        delete input[key];
      }
    };
    const $po2 = (input: any): any => {
      for (const key of Object.keys(input)) {
        if ("type" === key || "event" === key || "path" === key) continue;
        delete input[key];
      }
    };
    const $po3 = (input: any): any => {
      for (const key of Object.keys(input)) {
        if ("type" === key || "log" === key) continue;
        delete input[key];
      }
    };
    const $pu0 = (input: any): any =>
      (() => {
        if ("workers@stdout" === input.type) return $po0(input);
        else if ("workers@state" === input.type) return $po1(input);
        else if ("watcher@change" === input.type) return $po2(input);
        else if ("milkio@logger" === input.type) return $po3(input);
        else
          $throws({
            expected: "(__type | __type.o1 | __type.o2 | __type.o3)",
            value: input,
          });
      })();
    const __is = (input: any): input is CookbookSubscribeEmits => "object" === typeof input && null !== input && $iu0(input);
    let errors: any;
    let $report: any;
    const __validate = (input: any): typia.IValidation<CookbookSubscribeEmits> => {
      if (false === __is(input)) {
        errors = [];
        $report = (typia.misc.validatePrune as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true) =>
          ((("object" === typeof input && null !== input) ||
            $report(true, {
              path: _path + "",
              expected: "(__type | __type.o1 | __type.o2 | __type.o3)",
              value: input,
            })) &&
            $vu0(input, _path + "", true)) ||
          $report(true, {
            path: _path + "",
            expected: "(__type | __type.o1 | __type.o2 | __type.o3)",
            value: input,
          }))(input, "$input", true);
        const success = 0 === errors.length;
        return {
          success,
          errors,
          data: success ? input : undefined,
        } as any;
      }
      return {
        success: true,
        errors: [],
        data: input,
      } as any;
    };
    const __prune = (input: CookbookSubscribeEmits): void => {
      if ("object" === typeof input && null !== input) $pu0(input);
    };
    return (input: any): typia.IValidation<CookbookSubscribeEmits> => {
      const result = __validate(input);
      if (result.success) __prune(input);
      return result;
    };
  })()(results);
  let error = null;
  if (!checkResult.success) {
    const error: any = checkResult.errors.at(0)!;
    error.message = `The "cookbook.toml" format is incorrect, [${error.path.slice(7)}] should be ${error.expected}, but it is actually ${error.value}. You may be missing some properties in the configuration item, or adding some properties that will not be used. If you have extra properties, these properties are likely due to a misspelling.`;
    Error.captureStackTrace(error);
    results = null;
  }
  return [error, results];
};
