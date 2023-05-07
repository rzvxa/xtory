import { ChannelsRenderer, IpcAction } from 'shared/types';
import onProjectOpenedIpcAction from './ipc/actions/onProjectOpened';
import onProjectTreeUpdatedIpcAction from './ipc/actions/onProjectTreeUpdated';

const on = (channel: ChannelsRenderer, ipcAction: IpcAction): void => {
  window.electron.ipcRenderer.on(channel, ipcAction);
};

on(ChannelsRenderer.onProjectOpened, onProjectOpenedIpcAction);
on(ChannelsRenderer.onProjectTreeUpdated, onProjectTreeUpdatedIpcAction);
