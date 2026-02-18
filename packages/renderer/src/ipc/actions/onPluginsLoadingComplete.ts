import { IpcEvent } from '@xtory/shared';
import { store } from 'renderer/state/store/index';
import { setPluginsLoaded } from 'renderer/state/store/plugins';
import { getPluginLoadStartTime } from './onPluginsLoadingStart';

export default function onPluginsLoadingComplete(
  _event: IpcEvent,
  pluginCount: number = 0
) {
  const startTime = getPluginLoadStartTime();
  const loadTime = Date.now() - startTime;
  store.dispatch(setPluginsLoaded({ pluginCount, loadTime }));
}
