import { config } from "milkio";

export default config(
  async (env) => ({
    foo: "default",
    bar: 10000,
  }),
  {
    development: (env) => ({
      foo: "dev",
    }),
  },
);
