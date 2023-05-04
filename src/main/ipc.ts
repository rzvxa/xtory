import { ipcMain } from 'electron';

import { Channels, IpcAction, IpcInvoke } from './ipc/types';

import browseFileSystemIpcInvoke from './ipc/invokes/browseFileSystem';

const on = (channel: Channels, ipcAction: IpcAction): void => {
  ipcMain.on(channel, ipcAction);
};

const handle = (channel: Channels, ipcAction: IpcInvoke): void => {
  ipcMain.handle(channel, ipcAction);
};

handle(Channels.browseFileSystem, browseFileSystemIpcInvoke);
