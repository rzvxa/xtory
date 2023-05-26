import { ipcMain } from 'electron';

import { ChannelsMain, IpcAction, IpcInvoke } from 'shared/types';

import fsMoveIpcAction from './ipc/actions/fsMove';
import fsRemoveIpcAction from './ipc/actions/fsRemove';

import browseFileSystemIpcInvoke from './ipc/invokes/browseFileSystem';
import createNewProjectIpcInvoke from './ipc/invokes/createNewProject';
import fspExistsIpcInvoke from './ipc/invokes/fspExists';
import fspMkdirIpcInvoke from './ipc/invokes/fspMkdir';
import getXtoryTemplatesIpcInvoke from './ipc/invokes/getXtoryTemplates';
import openProjectIpcInvoke from './ipc/invokes/openProject';

const on = (channel: ChannelsMain, ipcAction: IpcAction): void => {
  ipcMain.on(channel, ipcAction);
};

const handle = (channel: ChannelsMain, ipcAction: IpcInvoke): void => {
  ipcMain.handle(channel, ipcAction);
};

on(ChannelsMain.fsMove, fsMoveIpcAction);
on(ChannelsMain.fsRemove, fsRemoveIpcAction);

handle(ChannelsMain.browseFileSystem, browseFileSystemIpcInvoke);
handle(ChannelsMain.createNewProject, createNewProjectIpcInvoke);
handle(ChannelsMain.fspExists, fspExistsIpcInvoke);
handle(ChannelsMain.fspMkdir, fspMkdirIpcInvoke);
handle(ChannelsMain.getXtoryTemplates, getXtoryTemplatesIpcInvoke);
handle(ChannelsMain.openProject, openProjectIpcInvoke);
