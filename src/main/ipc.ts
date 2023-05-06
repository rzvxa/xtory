import { ipcMain } from 'electron';

import { ChannelsMain, IpcAction, IpcInvoke } from 'shared/types';

import browseFileSystemIpcInvoke from './ipc/invokes/browseFileSystem';
import createNewProjectIpcInvoke from './ipc/invokes/createNewProject';
import getXtoryTemplatesIpcInvoke from './ipc/invokes/getXtoryTemplates';
import openProjectInvoke from './ipc/invokes/openProject';

const on = (channel: ChannelsMain, ipcAction: IpcAction): void => {
  ipcMain.on(channel, ipcAction);
};

const handle = (channel: ChannelsMain, ipcAction: IpcInvoke): void => {
  ipcMain.handle(channel, ipcAction);
};

handle(ChannelsMain.browseFileSystem, browseFileSystemIpcInvoke);
handle(ChannelsMain.createNewProject, createNewProjectIpcInvoke);
handle(ChannelsMain.getXtoryTemplates, getXtoryTemplatesIpcInvoke);
handle(ChannelsMain.openProject, openProjectInvoke);
