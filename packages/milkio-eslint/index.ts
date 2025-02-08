import { typescript } from "@antfu/eslint-config";
import type { TypedFlatConfigItem } from "@antfu/eslint-config";

export default async function milkio(options?: TypedFlatConfigItem | Promise<TypedFlatConfigItem>): Promise<Array<TypedFlatConfigItem>> {
  const rules: Array<TypedFlatConfigItem> = [];

  rules.push({
    ignores: ["{projects,packages}/*/.milkio/**", "{projects,packages}/*/public", "{projects,packages}/*/assets", ".commands/**", ".templates/**", ".old/**", ".trash/**"],
  });

  if (options) rules.push(await options);

  // other typescript files
  rules.push({
    files: ["{projects,packages}/**/*.ts"],
    ignores: ["{projects,packages}/**/*.d.ts"],
    rules: {
      ...(await typescript()).at(-1)!.rules,
      "ts/ban-ts-comment": "off",
      "ts/method-signature-style": "off",
      "antfu/no-top-level-await": "off",
      "ts/consistent-type-definitions": "off",
    },
  });

  // actions & streams
  // Add some new rules to the normal rules
  rules.push({
    files: ["{projects,packages}/**/*.action.ts", "{projects,packages}/**/*.stream.ts"],
    rules: {
      ...(await typescript()).at(-1)!.rules,
      "antfu/top-level-function": "error",
      "ts/no-empty-object-type": "off",
      "unused-imports/no-unused-vars": "off",
      "no-unused-vars": ["error", { args: "none" }],
      "ts/explicit-function-return-type": "error",
    },
  });

  // runtime
  // This contains entry files for different runtimes, so no validation rules are used, but the top level await is prohibited
  rules.push({
    ignores: ["{projects,packages}/*/runtime/*.{js,cjs,mjs,ts,mts,cts,jsx,tsx}"],
  });

  // tests
  rules.push({
    ignores: ["{projects,packages}/**/*.test.{ts,js}"],
  });

  return rules;
}
