import LogLevel from './logLevel';

export default interface Logger {
  trace: (message: unknown | unknown[], tags: string[]) => void;
  debug: (message: unknown | unknown[], tags: string[]) => void;
  info: (message: unknown | unknown[], tags: string[]) => void;
  warning: (message: unknown | unknown[], tags: string[]) => void;
  error: (message: unknown | unknown[], tags: string[]) => void;
  fatal: (message: unknown | unknown[], tags: string[]) => void;
  log: (logLevel: LogLevel, tags: string[], ...args: unknown[]) => void;
}
