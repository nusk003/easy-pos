import { ConsoleLogger } from '@nestjs/common';
import { log } from './log';

export class NestDevelopmentLogger extends ConsoleLogger {
  log(message: unknown, context?: string | undefined) {
    if (
      context &&
      [
        'NestFactory',
        'InstanceLoader',
        'RouterExplorer',
        'RoutesResolver',
      ].includes(context)
    ) {
      return;
    }

    log.info('nest', message);
  }

  warn(message: unknown) {
    log.warn(message);
  }

  error(message: unknown, stack?: string) {
    log.error(message);

    if (stack) {
      log.error(stack);
    }
  }
}
