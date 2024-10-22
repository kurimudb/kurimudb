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
      .createStep()
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
      /**
       * Calculate the remainder of _cDiv and 10
       */
      .step((stage) => {
        const cRem = stage._cDiv % 10;
        return {
          cRem,
        };
      })
      .run();
  },
});
