import { readFile, readdir } from 'fs/promises';
import { fsUtils } from 'main/utils';

import { ChannelsRenderer, Logger, LogLevel } from 'shared/types';
import { sanitizePath, tryGetAsync } from 'shared/utils';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';

class LoggingService implements Logger {
  messageBroker: ProjectMessageBroker;

  logger: Logger;

  constructor(logger: Logger, messageBroker: ProjectMessageBroker) {
    this.logger = logger;
    this.messageBroker = messageBroker;
  }

  trace(message: string) {
    this.logger?.trace(message);
  }

  debug(message: string) {
    this.logger?.debug(message);
  }

  info(message: string) {
    this.logger?.info(message);
  }

  warning(message: string) {
    this.logger?.warning(message);
  }

  error(message: string) {
    this.logger?.error(message);
  }

  fatal(message: string) {
    this.logger?.fatal(message);
  }

  log(message: string, logLevel: LogLevel) {
    this.logger?.log(message, logLevel);
  }
}

export default LoggingService;
