import { relative } from "path";
import { argv, cwd } from "node:process";
// @ts-ignore
import { camel, hump, hyphen } from "@poech/camel-hump-under";

export type CreateTemplateTools = {
  name: () => string;
  directory: () => string;
  route: () => string;
  src: () => string;
  camel: (str: string) => string;
  hump: (str: string) => string;
  hyphen: (str: string) => string;
};

export type CreateTemplateFn = (tools: CreateTemplateTools) =>
  | {
      path: string;
      content: string;
    }
  | Promise<{
      path: string;
      content: string;
    }>;

export async function createTemplate(fn: CreateTemplateFn) {
  const tools = {
    name: () => argv[2],
    directory: () => argv[3],
    route: () => {
      const pathArr = relative(cwd().replaceAll("\\", "/"), argv[3]).split("/").slice(2);
      if (pathArr[0] === "app") pathArr.shift();
      else if (pathArr[0] === "call") pathArr[0] = "$call";
      let path = pathArr.join("/");
      if (path.length > 0) return `/${path}/${argv[2]}`;
      if (path !== "/index" && path.endsWith("/index")) path = path.slice(0, path.length - 6);
      return path;
    },
    src: () => {
      const patharr = argv[3].split("/");
      const i = patharr.length - patharr.findIndex((str: string) => str.startsWith("src")) - 1;
      let path = "";
      for (let j = 0; j < i; j++) {
        path += "../";
      }
      return path;
    },
    camel: (str: string) => camel(str).replaceAll("-", "").replaceAll("_", ""),
    hump: (str: string) => hump(str).replaceAll("-", "").replaceAll("_", ""),
    hyphen: (str: string) => hyphen(str).replaceAll("_", ""),
  };
  const file = await fn(tools);
  await Bun.write(file.path, file.content);
}
