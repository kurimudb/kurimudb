import typia, { type IValidation } from "typia";
import { TSON } from "@southern-aurora/tson";
import { reject, type $context, type $meta, type Logger, type Results, type GeneratedInit } from "..";
import { headersToJSON } from "../utils/headers-to-json";

export const __initExecuter = (generated: GeneratedInit, runtime: any) => {
  const __execute = async (
    routeSchema: any,
    options: {
      createdExecuteId: string;
      createdLogger: Logger;
      path: string;
      headers: Record<string, string> | Headers;
      mixinContext: Record<any, any> | undefined;
    } & (
      | {
          params: Record<any, any>;
          paramsType: "raw";
        }
      | {
          params: string;
          paramsType: "string";
        }
    ),
  ): Promise<{ executeId: string; headers: Headers; params: Record<any, unknown>; results: Results<any>; context: $context; meta: Readonly<$meta>; type: "action" | "stream"; emptyResult: boolean; resultsTypeSafety: boolean }> => {
    const executeId: string = options.createdExecuteId;
    let headers: Headers;
    if (!(options.headers instanceof Headers)) {
      // @ts-ignore
      headers = new Headers({
        ...options.headers,
      });
    } else {
      headers = options.headers;
    }
    if (!("toJSON" in headers)) (headers as any).toJSON = () => headersToJSON(headers);

    let params: Record<any, unknown>;
    if (options.paramsType === "raw") {
      params = options.params;
      if (typeof params === "undefined") params = {};
    } else {
      if (options.params === "") params = {};
      else {
        try {
          params = TSON.parse(options.params);
        } catch (error) {
          throw reject("PARAMS_TYPE_NOT_SUPPORTED", { expected: "json" });
        }
        if (typeof params === "undefined") params = {};
      }
    }
    if (typeof params !== "object" || Array.isArray(params)) throw reject("PARAMS_TYPE_NOT_SUPPORTED", { expected: "json" });
    if ("$milkioGenerateParams" in params && params.$milkioGenerateParams === "enable") {
      if (!runtime.develop) throw reject("NOT_DEVELOP_MODE", "This feature must be in cookbook to use.");
      delete params.$milkioGenerateParams;
      let paramsRand = routeSchema.randomParams();
      if (paramsRand === undefined || paramsRand === null) paramsRand = {};
      params = { ...paramsRand, ...params };
    }
    if (options.mixinContext?.http?.params?.string) options.mixinContext.http.params.parsed = params; // listen でパースしたパラメータを渡す
    const context = {
      ...(options.mixinContext ? options.mixinContext : {}),
      develop: runtime.develop,
      path: options.path,
      logger: options.createdLogger,
      executeId: options.createdExecuteId,
      config: runtime.runtime.config,
      call: (module: any, options: any) => __call(context, module, options),
    } as unknown as $context;
    const results: Results<any> = { value: undefined };

    if (runtime.develop) {
      options.createdLogger.request(`headers - ${TSON.stringify(headers.toJSON())}`, `\nparams - ${TSON.stringify(params)}`);
    }

    const module = await routeSchema.module();
    let meta = (module.default?.meta ? module.default?.meta : {}) as unknown as Readonly<$meta>;

    if (meta.typeSafety === undefined || meta.typeSafety === true) {
      const validation = routeSchema.validateParams(params) as IValidation<any>;
      if (!validation.success) throw reject("PARAMS_TYPE_INCORRECT", { ...validation.errors[0], message: `The value '${validation.errors[0].path}' is '${validation.errors[0].value}', which does not meet '${validation.errors[0].expected}' requirements.` });
    }

    await runtime.emit("milkio:executeBefore", { executeId: options.createdExecuteId, logger: options.createdLogger, path: options.path, meta, context });

    results.value = await module.default.handler(context, params);

    let resultsTypeSafety = false;
    if (results?.value?.$milkioType === "type-safety") {
      resultsTypeSafety = true;
      const validation = routeSchema.validateResults(results.value.value) as IValidation<any>;
      if (!validation.success) throw reject("RESULTS_TYPE_INCORRECT", { ...validation.errors[0], message: `The value '${validation.errors[0].path}' is '${validation.errors[0].value}', which does not meet '${validation.errors[0].expected}' requirements.` });
      results.value = results.value.value;
    }

    let emptyResult = false;
    if (results.value === undefined || results.value === null || results.value === "") {
      emptyResult = true;
      results.value = {};
    } else if (Array.isArray(results.value)) throw reject("FAIL", "The return type of the handler must be an object, which is currently an array.");
    else if (typeof results.value !== "object") throw reject("FAIL", "The return type of the handler must be an object, which is currently a primitive type.");

    await runtime.emit("milkio:executeAfter", { executeId: options.createdExecuteId, logger: options.createdLogger, path: options.path, meta, context, results });

    return { executeId, headers, params, results, context, meta, type: module.$milkioType, emptyResult, resultsTypeSafety };
  };

  const __call = async (context: $context, module: { default: any }, params?: any): Promise<any> => {
    const moduleAwaited = await module;
    return await moduleAwaited.default.handler(context, params);
  };

  return {
    __call,
    __execute,
  };
};
