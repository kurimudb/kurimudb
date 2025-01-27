import { expect, test } from "vitest";
import { astra } from "/test";

test.sequential("basic", async () => {
  const [context, reject, world] = await astra.createMirrorWorld(import.meta.url);
  const [error, results] = await world.execute("/context", {
    params: {},
  });
  if (error) throw reject("Milkio did not execute successfully", error);

  // Check if the return value is as expected
  // In /app/context.ts, the result is actually "fail", but the result was modified in /index.ts, so this test should pass
  expect(results.success).toBe("success");
});
