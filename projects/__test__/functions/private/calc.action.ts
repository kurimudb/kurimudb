import { action, reject } from "milkio";

export default action({
  async handler(
    context,
    params: {
      a: string;
      b: number;
      throw?: boolean;
    },
  ) {
    const count = Number(params.a) + params.b;
    context.logger.info("count", count);

    if (params.throw) throw reject("REQUEST_FAIL", "custom failed");

    return { count };
  },
});
