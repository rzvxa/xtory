import { ChannelsRenderer, IpcAction } from 'shared/types';
import onProjectOpenedIpcAction from './actions/onProjectOpened';
import onProjectTreeUpdatedIpcAction from './actions/onProjectTreeUpdated';
import toastMessageIpcAction from './actions/toastMessage';

const on = (channel: ChannelsRenderer, ipcAction: IpcAction): void => {
  window.electron.ipcRenderer.on(channel, ipcAction);
};

on(ChannelsRenderer.onProjectOpened, onProjectOpenedIpcAction);
on(ChannelsRenderer.onProjectTreeUpdated, onProjectTreeUpdatedIpcAction);
on(ChannelsRenderer.toastMessage, toastMessageIpcAction);
