import { env, argv, exit } from "node:process";
import { createWorld, reject } from "milkio";
import { generated } from "./.milkio/generated";
export type { generated } from "./.milkio/generated";

declare module "milkio" {
  interface $types {
    generated: typeof generated;
  }
  interface $context {
    say(): string;
  }
}

export const world = await createWorld(generated, {
  port: 9000,
  cookbook: !env.MILKIO_DEVELOP ? undefined : { cookbookPort: 8000 },
  argv: process.argv,
});

world.on("milkio:executeBefore", async (event) => {
  if (!event.context) throw reject("FAIL", "Event is not 'context'");
  if (!event.executeId) throw reject("FAIL", "Event is not 'executeId'");
  if (!event.logger) throw reject("FAIL", "Event is not 'logger'");
  if (!event.path) throw reject("FAIL", "Event is not 'path'");
  event.context.say = () => "hello world";
});

world.on("milkio:executeAfter", async (event) => {
  if (!event.context) throw reject("FAIL", "Event is not 'context'");
  if (!event.executeId) throw reject("FAIL", "Event is not 'executeId'");
  if (!event.logger) throw reject("FAIL", "Event is not 'logger'");
  if (!event.path) throw reject("FAIL", "Event is not 'path'");
  if (!event.results) throw reject("FAIL", "Event is not'results'");
  if (event.context.path === "/context") event.results.value = "success";
});

world.on("milkio:httpRequest", async (event) => {
  if (!event.executeId) throw reject("FAIL", "Event is not 'executeId'");
  if (!event.logger) throw reject("FAIL", "Event is not 'logger'");
  if (!event.path) throw reject("FAIL", "Event is not 'path'");
  if (!event.http) throw reject("FAIL", "Event is not 'http'");
});

world.on("milkio:httpResponse", async (event) => {
  if (!event.executeId) throw reject("FAIL", "Event is not 'executeId'");
  if (!event.logger) throw reject("FAIL", "Event is not 'logger'");
  if (!event.path) throw reject("FAIL", "Event is not 'path'");
  if (!event.http) throw reject("FAIL", "Event is not 'http'");
  if (!event.context) throw reject("FAIL", "Event is not 'context'");
});

// start
await world.commander(argv);
