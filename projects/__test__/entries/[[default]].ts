import { bootstrap } from "..";

const world = bootstrap();

export async function onRequest(context: { request: Request }) {
  console.log(
    "onRequest",
    (await world).listener.fetch({
      request: context.request,
      env: process.env,
      envMode: process.env.MILKIO_DEVELOP === "ENABLE" ? "development" : "production",
    }),
  );

  // biome-ignore lint/style/useTemplate: <explanation>
  return new Response("hello:" + context.request.url, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "x-edgefunctions-test": "Welcome to use Pages Functions.",
    },
  });
  // return (await world).listener.fetch({
  //   request: context.request,
  //   env: process.env,
  //   envMode: process.env.MILKIO_DEVELOP === "ENABLE" ? "development" : "production",
  // });
}
