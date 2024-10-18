import { createTemplate } from "@milkio/cookbook-template";
import { join } from "node:path";

await createTemplate(async (tools) => {
  return {
    path: join(tools.directory(), `${tools.hyphen(tools.name())}.action.ts`),
    content: `
import { action } from "milkio"

/**
 * ${tools.name()}
 */
export default action({
  async action(context, params: { /* your params.. */ }) {
    const message = \`hello world!\`

    return {
      say: message
    }
  }
})`.trim(),
  };
});
