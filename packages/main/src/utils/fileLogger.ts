import { Logger, LogLevel } from '@xtory/shared';
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

  trace(message: unknown | unknown[], tags: string[]) {
    this.log(LogLevel.trace, tags, message);
  }

  debug(message: unknown | unknown[], tags: string[]) {
    this.log(LogLevel.debug, tags, message);
  }

  info(message: unknown | unknown[], tags: string[]) {
    this.log(LogLevel.info, tags, message);
  }

  warning(message: unknown | unknown[], tags: string[]) {
    this.log(LogLevel.warning, tags, message);
  }

  error(message: unknown | unknown[], tags: string[]) {
    this.log(LogLevel.error, tags, message);
  }

  fatal(message: unknown | unknown[], tags: string[]) {
    this.log(LogLevel.fatal, tags, message);
  }

  // TODO: use tags and log level correctly here
  log(_logLevel: LogLevel, _tags: string[], ...args: unknown[]) {
    const message = args.reduce((a, c) => `${a} ${c}`, '') as string;
    if (!this.fileHandle) {
      throw Error('No FileHandle, Cannot write log!');
    }
    this.fileHandle?.appendFile(`${message}\n`);
  }
}
