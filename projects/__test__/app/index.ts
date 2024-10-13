import { action, reject } from "milkio";

export default action({
  async handler(
    context,
    params: {
      a: string;
      b: number;
    },
  ) {
    const count = Number(params.a) + params.b;
    context.logger.info("count", count);
    return count;
  },
});
