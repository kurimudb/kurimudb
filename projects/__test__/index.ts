import { createWorld, reject } from "milkio";
import { generated } from "./.milkio";
import { configSchema } from "./.milkio/config-schema";

declare module "milkio" {
  interface $types {
    generated: typeof generated;
    configSchema: typeof configSchema;
  }
  interface $context {
    say(): string;
  }
}

export async function bootstrap() {
  const world = await createWorld(generated, configSchema, {
    port: 9000,
    cookbook: { cookbookPort: 8000 },
    // develop: env.MILKIO_DEVELOP === "ENABLE",
    // argv: process.argv,
    develop: true,
    argv: [],
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
    if (event.context.path === "/context") event.results.value = { success: "success" };
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

  return world;
}
