import chalk from 'chalk';

class Log {
  private logWithScope(color: chalk.Chalk, ...args: any[]) {
    const [[scope, msg]] = args;
    console.log(`[${color(scope)}]`, msg);
  }

  private log(color: chalk.Chalk, ...args: any[]) {
    const [[msg]] = args;
    console.log(color(msg));
  }

  public info(msg: any): void;
  public info(scope: string, msg: any): void;
  info(...args: any[]) {
    if (args.length === 2) {
      this.logWithScope(chalk.gray, args);
    } else {
      this.log(chalk.white, args);
    }
  }

  public warn(msg: any): void;
  public warn(scope: string, msg: any): void;
  warn(...args: any[]) {
    if (args.length === 2) {
      this.logWithScope(chalk.yellow, args);
    } else {
      this.log(chalk.yellow, args);
    }
  }

  public error(msg: any): void;
  public error(scope: string, msg: any): void;
  error(...args: any[]) {
    if (args.length === 2) {
      this.logWithScope(chalk.red, args);
    } else {
      this.log(chalk.red, args);
    }
  }
}

export const log = new Log();
