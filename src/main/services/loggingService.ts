import { readFile, readdir } from 'fs/promises';
import { fsUtils } from 'main/utils';

import { ChannelsRenderer, Logger, LogLevel } from 'shared/types';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';

class LoggingService implements Logger {
  #logger: Logger;

  #messageBroker: ProjectMessageBroker;

  constructor(logger: Logger, messageBroker: ProjectMessageBroker) {
    this.#logger = logger;
    this.#messageBroker = messageBroker;
  }

  trace(message: string) {
    this.log(message, LogLevel.trace);
  }

  debug(message: string) {
    this.log(message, LogLevel.debug);
  }

  info(message: string) {
    this.log(message, LogLevel.info);
  }

  warning(message: string) {
    this.log(message, LogLevel.warning);
  }

  error(message: string) {
    this.log(message, LogLevel.error);
  }

  fatal(message: string) {
    this.log(message, LogLevel.fatal);
  }

  log(message: string, logLevel: LogLevel) {
    const fmessage = LoggingService.#formatMessage(message, logLevel);
    this.#broadcast(fmessage, logLevel);
    this.#logger?.log(fmessage, logLevel);
  }

  #broadcast(message: string, level: LogLevel) {
    this.#messageBroker(ChannelsRenderer.logMessage, { message, level });
  }

  static #formatMessage(message: string, logLevel: LogLevel): string {
    return `[${new Date().toLocaleString()}] [${
      LogLevel[logLevel]
    }] : ${message}`;
  }
}

export default LoggingService;
