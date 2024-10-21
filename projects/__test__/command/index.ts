import { world } from "..";
import { command } from "milkio";

export default command({
  async handler(commands, options) {
    Bun.serve({
      port: world.listener.port,
      async fetch(request) {
        return world.listener.fetch({
          request: request,
          env: process.env,
          envMode: "development",
        });
      },
    });
  },
});
