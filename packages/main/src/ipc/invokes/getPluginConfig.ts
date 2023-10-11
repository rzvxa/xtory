import { IpcMainInvokeEvent } from 'electron';
import project from 'main/project';
import type { PluginConfiguration } from 'main/services/projectSettingsService';

export interface PluginConfigResponse {
  plugins: { [name: string]: string };
  pluginsConfiguration: { [name: string]: PluginConfiguration };
}

export default async function getPluginConfig(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: IpcMainInvokeEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: undefined
): Promise<PluginConfigResponse> {
  if (!project.isOpen) {
    return { plugins: {}, pluginsConfiguration: {} };
  }

  const plugins = project.settingsService.get('plugins') || {};
  const pluginsConfiguration =
    project.settingsService.get('pluginsConfiguration') || {};

  return { plugins, pluginsConfiguration };
}
