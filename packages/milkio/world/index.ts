import { __initCommander, __initListener, __initExecuter, __initEventManager, type ExecuteId, type Logger, type Mixin, type GeneratedInit, type Ping, type LoggerSubmittingHandler, type LoggerInsertingHandler, type $context, $types } from "..";
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
  bootstraps?: Array<(world: MilkioWorld<any>) => Promise<void>>;
};

export type MilkioRuntimeInit<T extends MilkioInit> = Mixin<
  T,
  {
    executeId: (request: Request) => string | Promise<string>;
    runtime: {
      request: Map<ExecuteId, { logger: Logger }>;
      config: Awaited<ReturnType<$types["generated"]["configSchema"]>>;
      app: any;
    };
    on: Awaited<ReturnType<typeof __initEventManager>>["on"];
    off: Awaited<ReturnType<typeof __initEventManager>>["off"];
    emit: Awaited<ReturnType<typeof __initEventManager>>["emit"];
  }
>;

export const createWorld = async <MilkioOptions extends MilkioInit>(generated: GeneratedInit, configSchema: { get: () => Promise<Record<any, any>> }, options: MilkioOptions): Promise<MilkioWorld<MilkioOptions>> => {
  const executeId = options.executeId ?? defineDefaultExecuteIdGenerator();
  const config = await configSchema.get();

  const runtime = {
    request: new Map(),
    config,
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
  const world = {
    _: _,
    // event manager
    on: eventManager.on,
    off: eventManager.off,
    emit: eventManager.emit,
    // commander
    commander,
    // listener
    listener,
    // functions
    config,
  };

  runtime.app = world;

  if (Array.isArray(options.bootstraps)) {
    for (const bootstrap of options.bootstraps) {
      await bootstrap(world as MilkioWorld<MilkioOptions>);
    }
  }

  return world as MilkioWorld<MilkioOptions>;
};

export type MilkioWorld<MilkioOptions extends MilkioInit = MilkioInit> = {
  _: MilkioRuntimeInit<MilkioOptions>;
  // event manager
  on: Awaited<ReturnType<typeof __initEventManager>>["on"];
  off: Awaited<ReturnType<typeof __initEventManager>>["off"];
  emit: Awaited<ReturnType<typeof __initEventManager>>["emit"];
  ping: (options?: { timeout?: number }) => Promise<Ping>;
  // commander
  commander: Awaited<ReturnType<typeof __initCommander>>;
  // listener
  listener: Awaited<ReturnType<typeof __initListener>>;
  config: Readonly<Awaited<ReturnType<$types["configSchema"]["get"]>>>;
};
