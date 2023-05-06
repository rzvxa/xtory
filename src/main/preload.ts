// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ChannelsMain, ChannelsRenderer, IpcResult } from 'shared/types';

const electronHandler = {
  ipcRenderer: {
    on(channel: ChannelsRenderer, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: ChannelsRenderer, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    sendMessage(channel: ChannelsMain, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    invoke(
      channel: ChannelsMain,
      args?: unknown | unknown[]
    ): Promise<IpcResult | any> {
      return ipcRenderer.invoke(channel, args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
