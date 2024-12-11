import { defineIdGenerator } from "milkid";

const idGenerator = defineIdGenerator({
  length: 24,
  timestamp: true,
  entropy: false,
});

export const createId = idGenerator.createId;
