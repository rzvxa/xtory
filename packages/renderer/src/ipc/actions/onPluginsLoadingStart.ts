import { IpcEvent } from '@xtory/shared';
import { store } from 'renderer/state/store/index';
import { setPluginsLoading } from 'renderer/state/store/plugins';

// Store the start time globally to calculate duration later
let pluginLoadStartTime = 0;

export default function onPluginsLoadingStart(
  _event: IpcEvent,
  pluginCount: number = 0
) {
  pluginLoadStartTime = Date.now();
  store.dispatch(
    setPluginsLoading({
      isLoading: true,
      message: `Loading ${pluginCount} plugin${
        pluginCount !== 1 ? 's' : ''
      }...`,
    })
  );
}

export function getPluginLoadStartTime() {
  return pluginLoadStartTime;
}
