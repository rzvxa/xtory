import type { ChannelsRenderer, IpcAction } from '@xtory/plugin-api';

import addFileMenuItemAction from './actions/addFileMenuItem';
import onProjectOpenedIpcAction from './actions/onProjectOpened';
import onOpenFileAsTabAction from './actions/onOpenFileAsTab';
import onProjectTreeUpdatedIpcAction from './actions/onProjectTreeUpdated';
import toastMessageIpcAction from './actions/toastMessage';
import broadcastLogMessageIpcAction from './actions/broadcastLogMessage';
import onLoadPlugins from './actions/onLoadPlugins';
import onPluginsLoadingStart from './actions/onPluginsLoadingStart';
import onPluginsLoadingComplete from './actions/onPluginsLoadingComplete';

const on = (channel: ChannelsRenderer, ipcAction: IpcAction): void => {
  window.electron.ipcRenderer.on(channel, ipcAction);
};

on('addFileMenuItem', addFileMenuItemAction);
on('onProjectOpened', onProjectOpenedIpcAction);
on('onOpenFileAsTab', onOpenFileAsTabAction);
on('onProjectTreeUpdated', onProjectTreeUpdatedIpcAction);
on('toastMessage', toastMessageIpcAction);
on('broadcastLogMessage', broadcastLogMessageIpcAction);
on('onLoadPlugins', onLoadPlugins);
on('onPluginsLoadingStart', onPluginsLoadingStart);
on('onPluginsLoadingComplete', onPluginsLoadingComplete);
