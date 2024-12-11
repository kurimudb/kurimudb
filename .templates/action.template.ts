import { createTemplate } from "@milkio/cookbook-template";
import { join } from "node:path";

await createTemplate(async (tools) => {
  return {
    path: join(tools.directory(), `${tools.hyphen(tools.name())}.action.ts`),
    content: `
import { action } from "milkio";

/**
 * ${tools.name()}
 */
export default action({
  async handler(
    context,
    params: {
      /* your params.. */
    },
  ) {
    const message = "hello world!";

    return {
      say: message,
    }
  }
});`.trim(),
  };
});

await createTemplate(async (tools) => {
  return {
    path: join(tools.directory(), `${tools.hyphen(tools.name())}.test.ts`),
    content: `
import { expect, test } from "vitest";
import { astra } from "/test";

test.sequential("basic", async () => {
  const [context, reject, world] = await astra.createMirrorWorld(import.meta.url);
  const [error, results] = await world.execute("${tools.route()}", {
    params: {
      //
    },
    generateParams: true,
  });
  if (error) throw reject("Milkio did not execute successfully", error);

  // Check if the return value is as expected
  // ...
});`.trim(),
  };
});
