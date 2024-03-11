import type * as prompts from "@clack/prompts";
import type { ChalkInstance } from "chalk";
import type { Command } from "commander";
import type { default as Conf, Schema } from "conf";
import type { Execa$, execa } from "execa";
import type * as fs from "fs-extra";
import type { json } from "./../core/utils/json";

export interface MetaType {
  paths: {
    cwd: string;
    home: string;
  };
}

export interface CommandOptions {
  scope: string;
  command: string;
  description?: string;
  alias?: string;
  action?: (...args: any[]) => void;
  options?: {
    flags: string;
    description: string;
    defaultValue?: string;
  }[];
}

export interface CliContext {
  registerCommand: (options: CommandOptions) => Command | null;
  store: Map<string, Conf>;
  prompts: typeof prompts;
  chalk: ChalkInstance;
  log: {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    success: (...args: any[]) => void;
    debug: (...args: any[]) => void;
  };
  fs: typeof fs;
  meta: MetaType;
  $: Execa$;
  execa: typeof execa;
  clipboard: {
    getText: () => string;
    setText: (text: string) => void;
  };
  utils: {
    json: typeof json;
    commandExists: (command: string) => boolean;
  };
  checkLogin: () => boolean;
  getUserInfo: () => {
    name: string;
    password: string;
    nameMd5: string;
    auth: string;
  };
}

export interface CliInstance {
  ctx: CliContext;
}

export interface CliPlugin {
  name: string;
  config?: Schema<any>;
  handle: (ctx: CliContext) => Promise<void> | void;
}
