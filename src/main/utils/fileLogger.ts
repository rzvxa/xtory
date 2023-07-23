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

  trace(message: string, tags: string[]) {
    this.log(LogLevel.trace, tags, message);
  }

  debug(message: string, tags: string[]) {
    this.log(LogLevel.debug, tags, message);
  }

  info(message: string, tags: string[]) {
    this.log(LogLevel.info, tags, message);
  }

  warning(message: string, tags: string[]) {
    this.log(LogLevel.warning, tags, message);
  }

  error(message: string, tags: string[]) {
    this.log(LogLevel.error, tags, message);
  }

  fatal(message: string, tags: string[]) {
    this.log(LogLevel.fatal, tags, message);
  }

  log(logLevel: LogLevel, tags: string[], ...args: unknown[]) {
    const message = args.reduce((a, c) => `${a} ${c}`) as string;
    if (!this.fileHandle) {
      throw Error('No FileHandle, Cannot write log!');
    }
    this.fileHandle?.appendFile(`${message}\n`);
  }
}
