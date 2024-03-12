import { EventEmitter } from 'node:events';
import process from 'node:process';
import { Command } from 'commander';
import { description, version } from '../../package.json';
import { Plugin } from './Plugin';
import { Context } from './context';
import type { CliInstance } from '@/types/index';

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
