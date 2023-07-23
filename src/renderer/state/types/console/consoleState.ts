import { LogLevel, LogMessage } from 'shared/types';

export default interface ConsoleState {
  buffer: LogMessage[];
  logLevel: LogLevel;
}
