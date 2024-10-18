import type { $context } from "../context";

export const defineUse = <CreatorFn extends (context: $context) => Promise<unknown> | unknown>(creatorFn: CreatorFn): ((context: $context) => Promise<Awaited<ReturnType<CreatorFn>>>) => {
  let use: any | undefined;

  const getUse = async (context: $context) => {
    if (use === undefined) {
      use = await creatorFn(context);
    }
    return use;
  };

  return getUse;
};
