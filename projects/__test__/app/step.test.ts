import { expect, test } from "vitest";
import { astra } from "/.milkio/test";

test.sequential("basic", async () => {
  const [context, reject, world] = await astra.createMirrorWorld(import.meta.url);
  const [error, results] = await world.execute("/step", {
    params: {
      a: "2",
      b: 2,
    },
  });
  if (error) throw reject("Milkio did not execute successfully", error);

  // Check if the return value is as expected
  expect(results.cAdd).toBe(4);
  expect(results.cMul).toBe(8);
  expect((results as any)._cDiv).toBe(undefined);
  expect(results.cRem).toBe(0.5);
});
