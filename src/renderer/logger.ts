import { ChannelsMain, Logger, LogLevel } from 'shared/types';

class RendererLogger implements Logger {
  trace(message: string, tags: string[] = []) {
    this.log(LogLevel.trace, tags, message);
  }

  debug(message: string, tags: string[] = []) {
    this.log(LogLevel.debug, tags, message);
  }

  info(message: string, tags: string[] = []) {
    this.log(LogLevel.info, tags, message);
  }

  warning(message: string, tags: string[] = []) {
    this.log(LogLevel.warning, tags, message);
  }

  error(message: string, tags: string[] = []) {
    this.log(LogLevel.error, tags, message);
  }

  fatal(message: string, tags: string[] = []) {
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
