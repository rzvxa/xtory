import { ChannelsRenderer, IpcAction } from 'shared/types';
import onProjectOpenedIpcAction from './actions/onProjectOpened';
import onOpenFileAsTabAction from './actions/onOpenFileAsTab';
import onProjectTreeUpdatedIpcAction from './actions/onProjectTreeUpdated';
import toastMessageIpcAction from './actions/toastMessage';
import logMessageIpcAction from './actions/logMessage';

const on = (channel: ChannelsRenderer, ipcAction: IpcAction): void => {
  window.electron.ipcRenderer.on(channel, ipcAction);
};

on(ChannelsRenderer.onProjectOpened, onProjectOpenedIpcAction);
on(ChannelsRenderer.onOpenFileAsTab, onOpenFileAsTabAction);
on(ChannelsRenderer.onProjectTreeUpdated, onProjectTreeUpdatedIpcAction);
on(ChannelsRenderer.toastMessage, toastMessageIpcAction);
on(ChannelsRenderer.logMessage, logMessageIpcAction);
