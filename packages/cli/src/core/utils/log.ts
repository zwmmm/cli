import chalk from 'chalk';

const log = console.log;

export class Logger {
  public info(...args: any[]) {
    log(`${chalk.bold.cyan('INFO')} - `, ...args);
  }

  public error(...args: any[]) {
    log(`${chalk.bold.red('ERROR')} - `, ...args);
  }

  public warn(...args: any[]) {
    log(`${chalk.bold.yellow('WARN')} - `, ...args);
  }

  public success(...args: any[]) {
    log(`${chalk.bold.green('SUCCESS')} - `, ...args);
  }

  public debug(...args: any[]) {
    if (process.env.DEBUG) {
      log(`[${chalk.bold.magenta('DEBUG')}] - `, ...args);
    }
  }
}
