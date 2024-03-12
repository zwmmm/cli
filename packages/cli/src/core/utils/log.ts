import process from 'node:process';
import util from 'node:util';
import chalk from 'chalk';

function log(tag: string, ...args: any[]) {
  const formattedArgs = util.format(...args);
  // eslint-disable-next-line no-console
  console.log(`${tag} - `, formattedArgs);
}

export class Logger {
  public info = (...args: any[]) => log(chalk.bold.blue('INFO'), ...args);
  public error = (...args: any[]) => log(chalk.bold.red('ERROR'), ...args);
  public warn = (...args: any[]) => log(chalk.bold.yellow('WARN'), ...args);
  public success = (...args: any[]) => log(chalk.bold.green('SUCCESS'), ...args);

  public debug(...args: any[]) {
    if (process.env.DEBUG)
      log(`[${chalk.bold.magenta('DEBUG')}] - `, ...args);
  }
}
