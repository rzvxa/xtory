import LogLevel from './logLevel';

export default interface LogMessage {
  message: string;
  level: LogLevel;
  date: string;
  id: string;
}

export function formatLog({ message, level, date }: LogMessage): string {
  return `[${date}] [${LogLevel[level]}] : ${message}`;
}
