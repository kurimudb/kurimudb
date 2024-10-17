import { __initCommander, __initListener, __initExecuter, __initEventManager, type ExecuteId, type Logger, type Mixin, type GeneratedInit, type Execute, type Ping, type ContextCreatedHandler, LoggerSubmittingHandler, LoggerInsertingHandler } from "..";
import { defineDefaultExecuteIdGenerator } from "../execute/execute-id-generator";

export type MilkioInit = {
  port: number;
  develop: boolean;
  cookbook: {
    cookbookPort: number;
  };
  cors?: {
    corsAllowMethods?: string;
    corsAllowHeaders?: string;
    corsAllowOrigin?: string;
  };
  ignorePathLevel?: number;
  realIp?: (request: Request) => string;
  executeId?: (request: Request) => string | Promise<string>;
  onLoggerSubmitting?: LoggerSubmittingHandler;
  onLoggerInserting?: LoggerInsertingHandler;
};

export type MilkioRuntimeInit<T extends MilkioInit> = Mixin<
  T,
  {
    executeId: (request: Request) => string | Promise<string>;
    runtime: {
      request: Map<ExecuteId, { logger: Logger }>;
      app: any;
    };
    on: Awaited<ReturnType<typeof __initEventManager>>["on"];
    off: Awaited<ReturnType<typeof __initEventManager>>["off"];
    emit: Awaited<ReturnType<typeof __initEventManager>>["emit"];
  }
>;

export const createWorld = async <MilkioOptions extends MilkioInit>(generated: GeneratedInit, options: MilkioOptions): Promise<MilkioWorld<MilkioOptions>> => {
  const executeId = options.executeId ?? defineDefaultExecuteIdGenerator();

  const runtime = {
    request: new Map(),
  } as MilkioRuntimeInit<MilkioOptions>["runtime"];

  const eventManager = __initEventManager();

  const _: MilkioRuntimeInit<MilkioOptions> = {
    ...options,
    executeId,
    runtime,
    on: eventManager.on,
    off: eventManager.off,
    emit: eventManager.emit,
  };

  const executer = __initExecuter(generated, _);
  const commander = __initCommander(generated, _);
  const listener = __initListener(generated, _, executer);

  // Initialize the app
  const app = {
    _: _,
    // event manager
    on: eventManager.on,
    off: eventManager.off,
    emit: eventManager.emit,
    // executer
    _executer: executer,
    execute: executer.execute,
    ping: executer.ping,
    // commander
    commander,
    // listener
    listener,
  };

  runtime.app = app;

  return app as MilkioWorld<MilkioOptions>;
};

export type MilkioWorld<MilkioOptions extends MilkioInit = MilkioInit> = {
  _: MilkioRuntimeInit<MilkioOptions>;
  // event manager
  on: Awaited<ReturnType<typeof __initEventManager>>["on"];
  off: Awaited<ReturnType<typeof __initEventManager>>["off"];
  emit: Awaited<ReturnType<typeof __initEventManager>>["emit"];
  // executer
  _executer: Awaited<ReturnType<typeof __initExecuter<MilkioRuntimeInit<MilkioOptions>>>>;
  execute: Execute;
  ping: (options?: { timeout?: number }) => Promise<Ping>;
  // commander
  commander: Awaited<ReturnType<typeof __initCommander<MilkioRuntimeInit<MilkioOptions>>>>;
  // listener
  listener: Awaited<ReturnType<typeof __initListener<MilkioRuntimeInit<MilkioOptions>>>>;
};
