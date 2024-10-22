import { type MilkioHttpRequest, type MilkioHttpResponse, type $types, type Logger, type Steps, type Mixin, type ExecuteOptions, type Action } from "..";

export interface $context {
  develop: boolean;
  executeId: string;
  environment: string;
  path: string;
  logger: Logger;
  http?: ContextHttp<Record<any, any>>;
  createStep: () => Steps<{}>;
  getConfig: <Namespace extends keyof $types["generated"]["configSchema"]>(namespace: Namespace) => Promise<Readonly<Awaited<ReturnType<$types["generated"]["configSchema"][Namespace][0]>>>>;
  call: <Module extends Promise<{ default: Action<any> }>>(module: Module, params: Parameters<Awaited<Module>["default"]["handler"]>[1]) => Promise<ReturnType<Awaited<Module>["default"]["handler"]>>;
}

export type ContextHttp<ParamsParsed = any> = {
  url: URL;
  ip: string;
  path: { string: keyof $types["generated"]["routeSchema"]["$types"]; array: Array<string> };
  params: {
    string: string;
    parsed: ParamsParsed;
  };
  request: MilkioHttpRequest;
  response: MilkioHttpResponse;
};

export type ContextCreatedHandler = (context: $context) => Promise<void> | void;
