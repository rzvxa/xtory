import { IpcMainInvokeEvent } from 'electron';
import { FileTypeMap } from 'shared/types';
import project from 'main/project';

export default async function getFileTypes(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: IpcMainInvokeEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: undefined
): Promise<FileTypeMap> {
  const { pluginsService } = project;
  const fileTypePlugins = pluginsService.getFileTypePlugins();
  return fileTypePlugins;
}
