const ENCODING = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const ENCODING_FIRST_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const MAGIC_NUMBER = 733882188971;
const ID_LENGTH = 32;

let lastTime: number = 0;
let lastRandom: string = "";

export function createId(length?: number): string {
  const currentPRNG = detectPRNG();
  const seed = Date.now();
  if (seed <= lastTime) {
    const incrementedTime = encodeDate(seed);
    const incrementedRandom = (lastRandom = incrementBase32(lastRandom));
    return incrementedTime + incrementedRandom;
  } else {
    const incrementedTime = encodeDate(seed);
    lastTime = seed;
    const newRandom = (lastRandom = encodeRandom((length ?? ID_LENGTH) - incrementedTime.length, currentPRNG));
    return incrementedTime + newRandom;
  }
}

function detectPRNG(): () => number {
  let root = undefined as any;
  // @ts-ignore
  if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
    root = self;
  } else if (typeof window !== "undefined") {
    root = window;
  } else if (typeof globalThis !== "undefined") {
    root = globalThis;
  } else if (typeof self !== "undefined") {
    root = self;
  }

  const globalCrypto = (root && (root.crypto || root.msCrypto)) || (typeof crypto !== "undefined" ? crypto : null);
  if (typeof globalCrypto?.getRandomValues === "function") {
    return () => {
      const buffer = new Uint8Array(1);
      globalCrypto.getRandomValues(buffer);
      return buffer[0] / 0xff;
    };
  } else if (typeof globalCrypto?.randomBytes === "function") {
    return () => globalCrypto.randomBytes(1).readUInt8() / 0xff;
  }

  throw new Error("No PRNG found");
}

function encodeDate(timestampMs: number) {
  timestampMs = timestampMs - MAGIC_NUMBER;
  let result = "";
  if (timestampMs === 0) {
    return ENCODING[0];
  }
  let char = "";
  while (timestampMs > 0) {
    if (timestampMs < ENCODING.length) char = ENCODING_FIRST_CHAR[timestampMs % ENCODING_FIRST_CHAR.length];
    else char = ENCODING[timestampMs % ENCODING.length];
    result = char + result;
    timestampMs = Math.floor(timestampMs / ENCODING.length);
  }
  return result;
}

function randomChar(encoding: string, prng: () => number): string {
  let rand = Math.floor(prng() * encoding.length);
  if (rand === encoding.length) {
    rand = encoding.length - 1;
  }
  return encoding.charAt(rand);
}

function encodeRandom(len: number, detectPRNG: () => number): string {
  let str = "";
  for (; len > 0; len--) {
    str = randomChar(ENCODING, detectPRNG) + str;
  }
  return str;
}

function incrementBase32(str: string): string {
  let done: string = "";
  let index = str.length;
  let char: string;
  let charIndex: number;
  let output = str;
  const maxCharIndex = ENCODING.length - 1;
  while (!done && index-- >= 0) {
    char = output[index];
    charIndex = ENCODING.indexOf(char);
    if (charIndex === -1) throw new Error("Failed incrementing string");
    if (charIndex === maxCharIndex) {
      output = replaceCharAt(output, index, ENCODING[0]);
      continue;
    }
    done = replaceCharAt(output, index, ENCODING[charIndex + 1]);
  }
  if (typeof done === "string") {
    return done;
  }
  throw new Error("Failed incrementing string");
}

function replaceCharAt(str: string, index: number, char: string): string {
  if (index > str.length - 1) {
    return str;
  }
  return str.slice(0, index) + char + str.slice(index + 1);
}
