import { IpcMainInvokeEvent } from 'electron';
import { PluginConfig } from 'shared/types/plugin';
import project from 'main/project';

// TODO move it to shared types with a better name, Replace similar types with shared one
type FileTypeMap = { [name: string]: PluginConfig };

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
