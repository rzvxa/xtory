import { Logger, LogLevel } from 'shared/types';
import { open, FileHandle } from 'fs/promises';

export default class FileLogger implements Logger {
  filePath: string;

  fileHandle: FileHandle | null = null;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async init() {
    this.fileHandle = await open(this.filePath, 'a');
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
    if (!this.fileHandle) {
      throw Error('No FileHandle, Cannot write log!');
    }
    this.fileHandle?.appendFile(message);
  }
}
