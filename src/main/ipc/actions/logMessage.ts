import { IpcEvent, LogLevel } from 'shared/types';
import Project from 'main/project';

export default function logMessage(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { sender }: IpcEvent,
  message: string,
  logLevel: LogLevel
) {
  Project.logger.log(message, logLevel);
}
