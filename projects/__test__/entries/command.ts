import { bootstrap } from "..";

bootstrap().then(async (world) => {
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
});
