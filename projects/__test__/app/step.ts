import { action, reject } from "milkio";

export default action({
  async handler(
    context,
    params: {
      a: string;
      b: number;
    },
  ) {
    const result = await context
      // computational addition of a and b
      .step((stage) => {
        const cAdd = Number(params.a) + params.b;
        return {
          cAdd,
        };
      })
      // computational multiplication of cAdd and b
      .step((stage) => {
        const cMul = stage.cAdd * params.b;
        return {
          cMul,
        };
      })
      .run();

    context.logger.info("Result", result);

    return result;
  },
});
