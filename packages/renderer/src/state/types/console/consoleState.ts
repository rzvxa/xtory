import { LogLevel, LogMessage } from '@xtory/shared';

export default interface ConsoleState {
  buffer: LogMessage[];
  logLevel: LogLevel;
}
