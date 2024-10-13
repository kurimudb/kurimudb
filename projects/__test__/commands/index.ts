import { world } from "..";
import { command } from "milkio";

export default command({
  async handler(commands, options) {
    Bun.serve({
      port: world.listener.port,
      fetch: world.listener.fetch,
    });
  },
});
