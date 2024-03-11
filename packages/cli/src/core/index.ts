import type { CliInstance } from "@/types/index";
import { Command } from "commander";
import { EventEmitter } from "events";
import { description, version } from "../../package.json";
import { Plugin } from "./Plugin";
import { Context } from "./context";

export class Cli extends EventEmitter implements CliInstance {
  public command = new Command();
  public ctx = new Context(this.command);
  public plugin = new Plugin(this.ctx);

  public init() {
    this.command.version(version).description(description);
    this.plugin.init();
    this.command.parse(process.argv);
  }
}
