import { ChannelsRenderer } from 'shared/types';
import { IpcAction } from './ipc/types/ipcAction';

const on = (channel: ChannelsRenderer, ipcAction: IpcAction): void => {
  window.electron.ipcRenderer.on(channel, ipcAction);
};
