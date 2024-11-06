import { type $types, type GeneratedInit } from "../types";

export const config = <ConfigDefaultT extends ConfigDefault, ConfigEnvironmentsT extends ConfigEnvironments<ConfigDefaultT>>(def: ConfigDefaultT, envs: ConfigEnvironmentsT = {} as Record<any, any>): [ConfigDefaultT, ConfigEnvironmentsT] => {
  return [def, envs];
};

export const __getConfig = async <Namespace extends keyof $types["generated"]["configSchema"]>(generated: GeneratedInit, env: Record<any, any>, envMode: string, namespace: Namespace) => {
  if (generated.configSchema[namespace][1] && envMode in generated.configSchema[namespace][1]) {
    return {
      ...(await generated.configSchema[namespace][0](env)),
      ...(await generated.configSchema[namespace][1][envMode](env)),
    };
  } else {
    return {
      ...(await generated.configSchema[namespace][0](env)),
    };
  }
};

export type ConfigDefault = (env: Record<string, string>) => Promise<Record<string, unknown>> | Record<string, unknown>;

export type ConfigEnvironments<T extends ConfigDefault> = {
  [key: string]: (env: Record<string, string>) => Partial<Awaited<ReturnType<T>>> | Promise<Partial<Awaited<ReturnType<T>>>>;
};

export function envToString(value: string | number | undefined, defaultValue: string) {
  if (value === undefined) return defaultValue;

  return `${value}`;
}

export function envToNumber(value: string | undefined, defaultValue: number) {
  if (value === undefined) return defaultValue;

  return Number.parseInt(value, 10);
}

export function envToBoolean(value: string | number | undefined, defaultValue: boolean) {
  if (value === "true") return true;

  if (value === "false") return false;

  if (value === "") return false;

  if (undefined === value) return defaultValue;

  return Boolean(value);
}
