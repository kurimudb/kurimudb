import { createTemplate } from "@milkio/cookbook-template";
import { join } from "node:path";

await createTemplate(async (tools) => {
  return {
    path: join(tools.directory(), `${tools.hyphen(tools.name())}.action.ts`),
    content: `
import { stream } from "milkio";

/**
 * ${tools.name()}
 */
export default stream({
  async *handler(
    context,
    params: {
      /* your params.. */
    },
  ) {
    yield "hello,";
    yield "world!";
  }
});`.trim(),
  };
});
