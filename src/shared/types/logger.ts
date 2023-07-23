import LogLevel from './logLevel';

export default interface Logger {
  trace: (message: string, tags: string[]) => void;
  debug: (message: string, tags: string[]) => void;
  info: (message: string, tags: string[]) => void;
  warning: (message: string, tags: string[]) => void;
  error: (message: string, tags: string[]) => void;
  fatal: (message: string, tags: string[]) => void;
  log: (logLevel: LogLevel, tags: string[], ...args: unknown[]) => void;
}
