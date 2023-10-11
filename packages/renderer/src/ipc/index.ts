import { ChannelsRenderer, IpcAction } from '@xtory/shared';
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

on(ChannelsRenderer.addFileMenuItem, addFileMenuItemAction);
on(ChannelsRenderer.onProjectOpened, onProjectOpenedIpcAction);
on(ChannelsRenderer.onOpenFileAsTab, onOpenFileAsTabAction);
on(ChannelsRenderer.onProjectTreeUpdated, onProjectTreeUpdatedIpcAction);
on(ChannelsRenderer.toastMessage, toastMessageIpcAction);
on(ChannelsRenderer.broadcastLogMessage, broadcastLogMessageIpcAction);
on(ChannelsRenderer.onLoadPlugins, onLoadPlugins);
on(ChannelsRenderer.onPluginsLoadingStart, onPluginsLoadingStart);
on(ChannelsRenderer.onPluginsLoadingComplete, onPluginsLoadingComplete);
