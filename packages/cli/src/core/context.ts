import os from 'node:os';
import process from 'node:process';
import * as prompts from '@clack/prompts';
import chalk from 'chalk';
import clipboard from 'clipboardy';
import { Command } from 'commander';
import type Conf from 'conf';
import fs from 'fs-extra';
import { $, execa } from 'execa';
import type { CliContext, CommandOptions } from './../types/index';
import { Logger } from './utils/log';
import { json } from './utils/json';

export class Context implements CliContext {
  public prompts = prompts;
  public chalk = chalk;
  public log = new Logger();
  public meta = {
    paths: {
      cwd: process.cwd(),
      home: os.homedir(),
    },
  };

  public fs = fs;
  public $ = $;
  public execa = execa;
  public clipboard = {
    getText: clipboard.readSync,
    setText: clipboard.writeSync,
  };

  public utils = {
    json,
    commandExists: (command: string) => {
      try {
        this.$`${command}`;
        return true;
      }
      catch (error) {
        return false;
      }
    },
  };

  public store = new Map<string, Conf>();

  private commandList = new Map<string, string>();

  public constructor(public command: Command) { }

  public registerCommand = (options: CommandOptions) => {
    if (this.commandList.has(options.command)) {
      this.log.error(
        `命令 ${this.chalk.bgRed(options.command)} 已经被 ${this.chalk.bgCyan(
          this.commandList.get(options.command),
        )} 模块注册了`,
      );
      return null;
    }
    if (options.action) {
      this.commandList.set(options.command.split(' ')[0], options.scope);
      const command = this.command.command(options.command).action(options.action);
      if (options.description)
        command.description(options.description);

      if (options.alias)
        command.alias(options.alias);

      if (options.options) {
        options.options.forEach((option) => {
          command.option(option.flags, option.description, option.defaultValue);
        });
      }
      return command;
    }
    else {
      this.commandList.set(options.command, options.scope);
      const command = new Command(options.command);
      this.command.addCommand(command);
      return command;
    }
  };
}
