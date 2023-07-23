import { readFile, readdir } from 'fs/promises';
import { fsUtils } from 'main/utils';

import {
  ChannelsRenderer,
  Logger,
  LogLevel,
  LogMessage,
  formatLog,
} from 'shared/types';
import { uuidv4 } from 'shared/utils';
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
    const logMessage = {
      message,
      level: logLevel,
      date: new Date().toLocaleString(),
      id: uuidv4(),
    };
    const fmessage = formatLog(logMessage);
    this.#broadcast(logMessage);
    this.#logger?.log(fmessage, logLevel);
  }

  #broadcast(logMessage: LogMessage) {
    this.#messageBroker(ChannelsRenderer.broadcastLogMessage, logMessage);
  }
}

export default LoggingService;
