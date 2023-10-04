import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';

export default async function getFileTypes(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: IpcMainInvokeEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: undefined
): Promise<string[]> {
  const pluginsService = project.pluginsService;
  const fileTypes = pluginsService.getFileTypePlugins();
  return ['ok'];
}
