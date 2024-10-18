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
    const result = await context.call(import("./#private-folder/calc.action"), {
      a: params.a,
      b: params.b,
      throw: params.throw,
    });

    return result;
  },
});
