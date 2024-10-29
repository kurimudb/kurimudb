import { action } from "milkio";

/**
 * config
 */
export default action({
  async handler(context, params: {}) {
    const appConfig = await context.getConfig("app");

    return {
      ...appConfig,
    };
  },
});
