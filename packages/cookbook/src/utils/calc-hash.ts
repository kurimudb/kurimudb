import { XXH64 } from "xxh3-ts";

export const calcHash = (buffer: Buffer) => {
  return XXH64(buffer).toString(36);
};
