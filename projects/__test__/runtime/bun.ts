import { create } from "..";

async function bootstrap() {
  const world = await create();
  Bun.serve({
    port: world.listener.port,
    async fetch(request) {
      return world.listener.fetch({
        request: request,
        env: process.env,
        envMode: process.env.MILKIO_DEVELOP === "ENABLE" ? "development" : "production",
      });
    },
  });
}

void bootstrap();
