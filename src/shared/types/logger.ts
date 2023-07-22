import LogLevel from './logLevel';

export default interface Logger {
  trace: (message: string) => void;
  debug: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
  fatal: (message: string) => void;
  log: (message: string, logLevel: LogLevel) => void;
}
