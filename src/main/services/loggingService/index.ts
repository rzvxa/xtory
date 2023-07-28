import {
  ChannelsRenderer,
  Logger,
  LogLevel,
  LogMessage,
  formatLog,
} from 'shared/types';
import { uuidv4 } from 'shared/utils';
import { ProjectMessageBroker } from 'main/project/projectMessageBroker';
import IService from '../IService';

class LoggingService implements Logger, IService {
  #logger: Logger;

  #messageBroker: ProjectMessageBroker;

  constructor(logger: Logger, messageBroker: ProjectMessageBroker) {
    this.#logger = logger;
    this.#messageBroker = messageBroker;
  }

  async init(): Promise<boolean> {
    try {
      this.#logger.trace('Logger Initialized!', ['LoggingService']);
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
  }

  trace(message: unknown | unknown[], tags: string[] = []) {
    this.log(LogLevel.trace, tags, message);
  }

  debug(message: unknown | unknown[], tags: string[] = []) {
    this.log(LogLevel.debug, tags, message);
  }

  info(message: unknown | unknown[], tags: string[] = []) {
    this.log(LogLevel.info, tags, message);
  }

  warning(message: unknown | unknown[], tags: string[] = []) {
    this.log(LogLevel.warning, tags, message);
  }

  error(message: unknown | unknown[], tags: string[] = []) {
    this.log(LogLevel.error, tags, message);
  }

  fatal(message: unknown | unknown[], tags: string[] = []) {
    this.log(LogLevel.fatal, tags, message);
  }

  log(logLevel: LogLevel, tags: string[], ...args: unknown[]) {
    const message = args.reduce((a, c) => `${a} ${c}`, '') as string;
    console.log(message);
    const logMessage = {
      message,
      level: logLevel,
      tags,
      date: new Date().toLocaleString(),
      id: uuidv4(),
    };
    const fmessage = formatLog(logMessage);
    this.#broadcast(logMessage);
    this.#logger?.log(logLevel, tags, fmessage);
  }

  #broadcast(logMessage: LogMessage) {
    this.#messageBroker(ChannelsRenderer.broadcastLogMessage, logMessage);
  }
}

export default LoggingService;
