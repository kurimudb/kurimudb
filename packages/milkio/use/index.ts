import { $context } from "../context";

export const defineUse = <Mode extends "dynamic" | "static", Use extends Mode extends "static" ? () => Promise<unknown> | unknown : (...args: [$context, ...Array<unknown>]) => Promise<unknown> | unknown>(mode: Mode, use: Use): ((...args: Parameters<Use>) => Promise<Awaited<ReturnType<Use>>>) => {
  if (mode === "static") {
    let useCreated: any | undefined;

    const getUse = async () => {
      if (useCreated === undefined) {
        useCreated = await (use as any)();
      }
      return useCreated;
    };

    return getUse;
  } else {
    return use as any;
  }
};
