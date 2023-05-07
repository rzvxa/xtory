import { ChannelsRenderer, IpcAction } from 'shared/types';
import onProjectOpenedIpcAction from './ipc/actions/onProjectOpened';

const on = (channel: ChannelsRenderer, ipcAction: IpcAction): void => {
  window.electron.ipcRenderer.on(channel, ipcAction);
};

on(ChannelsRenderer.onProjectOpened, onProjectOpenedIpcAction);
