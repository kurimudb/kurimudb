import { XXH64 } from "xxh3-ts";
const ENCODING = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const ENCODING_FIRST_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

let lastTime: number = 0;
let lastCounter: bigint = 0n;

export type IdGeneratorOptions = {
  length?: number;
  timestamp: boolean;
  entropy?: boolean;
  hyphen?: boolean;
  sequential?: boolean;
  magicNumber?: number;
};

export function defineIdGenerator(options: IdGeneratorOptions) {
  const textEncoder = new TextEncoder();
  if (options.length !== undefined && options.length < 16) throw new Error("length must be larger than 16");
  const randLength = (options.length ?? 24) + 1 - (options.timestamp ? 7 : 0) - (options.entropy ? 5 : 0);
  let maxRandCharacter = "";
  for (let i = 0; i < randLength; i++) maxRandCharacter += "z";
  const maxRandDecimal = characterToDecimal(maxRandCharacter);

  return {
    createId(entropy?: string | Buffer) {
      if (options.entropy && !entropy) throw new Error("entropy is required");

      const now = Date.now();

      let id = "";
      if (options.timestamp) {
        id += decimalToCharacter(BigInt(now - (options.magicNumber ?? 733882188971)));
        if (id.length > 7) id = id.slice(-7);
      }
      if (entropy) {
        if (options.hyphen) id += "-";
        if (Buffer.isBuffer(entropy)) {
          id += decimalToCharacter(BigInt(XXH64(entropy).toString(10))).slice(2, 7);
        } else if (typeof entropy === "string") {
          id += decimalToCharacter(BigInt(XXH64(Buffer.from(textEncoder.encode(entropy))).toString(10))).slice(2, 7);
        }
      }
      if (randLength > 1) {
        if (options.hyphen) id += "-";
        let decimal = random(maxRandDecimal);
        if (options.sequential !== false) {
          if (lastTime !== now) {
            lastTime = now;
            lastCounter = 0n;
          } else {
            decimal = decimal + lastCounter++;
          }
        }
        id += decimalToCharacter(random(decimal)).padStart(randLength, "0").slice(1, randLength);
      }

      return id;
    },
  };
}

function decimalToCharacter(decimal: bigint): string {
  let result = "";
  while (decimal > 0) {
    if (decimal <= 62n) {
      result = ENCODING_FIRST_CHAR[0] + result;
      decimal = decimal / 52n;
    } else {
      result = ENCODING[Number(decimal % 62n)] + result;
      decimal = decimal / 62n;
    }
  }
  return result || "0";
}

function characterToDecimal(character: string): bigint {
  let decimal = 0n;
  const base = BigInt(ENCODING.length);
  for (let i = 0; i < character.length; i++) {
    const charIndex = ENCODING.indexOf(character[i]);
    decimal = decimal * base + BigInt(charIndex);
  }
  return decimal;
}

function random(limit: bigint) {
  if (limit <= 0n) throw new Error("Limit must be larger than 0");

  let width = 0n;
  for (let n = limit; n > 0n; width++) {
    n >>= 64n;
  }

  const max = 1n << (width * 64n);
  const buf = new BigUint64Array(Number(width));
  const min = max - (max % limit);

  let sample = 0n;
  do {
    const arrayBuffer = crypto.getRandomValues(new Uint8Array(buf.length * 8));
    const view = new DataView(arrayBuffer.buffer);
    sample = 0n;
    for (let i = 0; i < buf.length; i++) {
      sample = (sample << 64n) | BigInt(view.getBigUint64(i * 8));
    }
  } while (sample >= min);

  return sample % limit;
}
