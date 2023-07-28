import { ChannelsMain, Logger, LogLevel } from 'shared/types';

class RendererLogger implements Logger {
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

  // eslint-disable-next-line class-methods-use-this
  log(level: LogLevel, tags: string[], ...args: unknown[]) {
    window.electron.ipcRenderer.sendMessage(
      ChannelsMain.logMessage,
      level,
      tags,
      ...args
    );
  }
}

const logger = new RendererLogger();

export default logger;
