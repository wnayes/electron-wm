import { isAbsolute } from "path";
import { requirePackage } from "./npmPackageProxy";

export type PluginSpecifiers = string | string[];

export interface IPluginConfig {
  wallpaper?: PluginSpecifiers;
}

export interface IConfig {
  initialLayout: string;
  initialTag: string;
  tags: string[];
  term: string;
  plugins?: IPluginConfig;
  version?: string;
}

export const defaultConfig: IConfig = {
  initialLayout: "Floating",
  initialTag: "1",
  tags: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  term: "xterm",
  plugins: {},
};

/** Resolves plugins into their runtime types. */
export async function resolvePlugins<T>(specifiers: PluginSpecifiers, installDirectory: string): Promise<T[]> {
  if (typeof specifiers === "string") {
    specifiers = [specifiers];
  }

  const plugins: T[] = [];
  for (const specifier of specifiers) {
    let loadedModule: T;
    if (isAbsolute(specifier)) {
      loadedModule = require(specifier);
    } else {
      loadedModule = await requirePackage<T>(specifier, installDirectory);
    }

    if (loadedModule != null) {
      plugins.push(loadedModule);
    }
  }
  return plugins;
}
