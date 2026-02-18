import { IpcEvent, LogLevel } from '@xtory/shared';
import Project from 'main/project';

export default function logMessage(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { sender }: IpcEvent,
  logLevel: LogLevel,
  tags: string[],
  ...args: unknown[]
) {
  Project.logger.log(logLevel, tags, ...args);
}
