import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';

export default async function updatePluginEnabled(
  _event: IpcMainInvokeEvent,
  pluginName: string,
  enabled: boolean
): Promise<void> {
  if (!project.isOpen) {
    throw new Error('No project is open');
  }

  const pluginsConfig =
    project.settingsService.get('pluginsConfiguration') || {};
  pluginsConfig[pluginName] = { enabled };

  await project.settingsService.set('pluginsConfiguration', pluginsConfig);
}
