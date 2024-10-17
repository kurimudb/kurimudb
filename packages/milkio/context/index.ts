import { type MilkioHttpRequest, type MilkioHttpResponse, type $types, type Logger, type Steps, type Execute } from "..";

export interface $context {
  executeId: string;
  path: string;
  logger: Logger;
  http?: ContextHttp<Record<any, any>>;
  step: Steps<{}>["step"];
  execute: Execute;
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
