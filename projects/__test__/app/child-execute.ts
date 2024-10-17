import { action, reject } from "milkio";
import { world } from "..";

export default action({
  async handler(
    context,
    params: {
      a: string;
      b: number;
      throw?: boolean;
    },
  ) {
    const [error, result] = await context.execute("/action-hello-world", {
      params: {
        a: params.a,
        b: params.b,
        throw: params.throw,
      },
    });
    if (error) throw error;
    return result + 1;
  },
});
