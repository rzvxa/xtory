// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import type {
  IpcAction,
  IpcResult,
  ChannelsMain,
  ChannelsRenderer,
} from '@xtory/plugin-api';
import type { ElectronHandler } from '@xtory/plugin-api/renderer';

const electronHandler: ElectronHandler = {
  ipcRenderer: {
    on(channel: ChannelsRenderer, ipcAction: IpcAction) {
      ipcRenderer.on(channel, ipcAction);

      return () => {
        ipcRenderer.removeListener(channel, ipcAction);
      };
    },
    once(channel: ChannelsRenderer, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    sendMessage(channel: ChannelsMain, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    invoke(
      channel: ChannelsMain,
      ...args: unknown[]
    ): Promise<IpcResult | any> {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
contextBridge.exposeInMainWorld('platform', process.platform);
