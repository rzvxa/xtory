import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';

export default async function updatePluginConfig(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: IpcMainInvokeEvent,
  pluginConfig: { [name: string]: string }
): Promise<void> {
  if (!project.isOpen) {
    throw new Error('No project is open');
  }

  await project.settingsService.set('plugins', pluginConfig);
}
