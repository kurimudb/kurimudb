import { action, reject } from "milkio";

export default action({
  async handler(
    context,
    params: {
      a: string;
      b: number;
    },
  ) {
    return await context
      /**
       * computational addition of a and b
       */
      .step((stage) => {
        const cAdd = Number(params.a) + params.b;
        return {
          cAdd,
        };
      })
      /**
       * computational multiplication of cAdd and b
       */
      .step((stage) => {
        const cMul = stage.cAdd * params.b;
        return {
          cMul,
        };
      })
      /**
       * computational division of cAdd and cMul
       */
      .step((stage) => {
        const _cDiv = stage.cAdd / stage.cMul;
        return {
          _cDiv,
        };
      })
      .run();
  },
});
