import { ipcMain } from 'electron';

import { Channels } from 'shared/types';

import { IpcAction, IpcInvoke } from './ipc/types';

import browseFileSystemIpcInvoke from './ipc/invokes/browseFileSystem';
import createNewProjectIpcInvoke from './ipc/invokes/createNewProject';
import getXtoryTemplatesIpcInvoke from './ipc/invokes/getXtoryTemplates';
import openProjectInvoke from './ipc/invokes/openProject';

const on = (channel: Channels, ipcAction: IpcAction): void => {
  ipcMain.on(channel, ipcAction);
};

const handle = (channel: Channels, ipcAction: IpcInvoke): void => {
  ipcMain.handle(channel, ipcAction);
};

handle(Channels.browseFileSystem, browseFileSystemIpcInvoke);
handle(Channels.createNewProject, createNewProjectIpcInvoke);
handle(Channels.getXtoryTemplates, getXtoryTemplatesIpcInvoke);
handle(Channels.openProject, openProjectInvoke);
