import LogLevel from './logLevel';

export default interface LogMessage {
  message: string;
  level: LogLevel;
  tags: string[];
  date: string;
  id: string;
}

export function formatLog({ message, level, date }: LogMessage): string {
  return `[${date}] [${LogLevel[level]}] : ${message}`;
}
