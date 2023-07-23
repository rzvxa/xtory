import { ChannelsMain, Logger, LogLevel } from 'shared/types';

class RendererLogger implements Logger {
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

  // eslint-disable-next-line class-methods-use-this
  log(message: string, level: LogLevel) {
    window.electron.ipcRenderer.sendMessage(
      ChannelsMain.logMessage,
      message,
      level
    );
  }
}

const logger = new RendererLogger();

export default logger;
