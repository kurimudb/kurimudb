import type { $context, ContextHttp, Results, Logger, $meta, MilkioWorld } from '..'

export function handler<HandlerInitT extends HandlerInit>(init: HandlerInitT): HandlerInitT {
  return init
}

export type HandlerInit = (world: MilkioWorld) => Promise<void> | void