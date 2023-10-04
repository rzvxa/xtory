import { ipcMain } from 'electron';

import { ChannelsMain, IpcAction, IpcInvoke } from 'shared/types';

import fsMoveIpcAction from './actions/fsMove';
import fsRemoveIpcAction from './actions/fsRemove';
import openFileAsTabAction from './actions/openFileAsTab';
import revealPathInOSAction from './actions/revealPathInOS';
import logMessageAction from './actions/logMessage';

import browseFileSystemIpcInvoke from './invokes/browseFileSystem';
import createNewProjectIpcInvoke from './invokes/createNewProject';
import fspExistsIpcInvoke from './invokes/fspExists';
import fspMkdirIpcInvoke from './invokes/fspMkdir';
import fspWriteFileIpcInvoke from './invokes/fspWriteFile';
import getXtoryTemplatesIpcInvoke from './invokes/getXtoryTemplates';
import getFileTypesIpcInvoke from './invokes/getFileTypes';
import openProjectIpcInvoke from './invokes/openProject';

const on = (channel: ChannelsMain, ipcAction: IpcAction): void => {
  ipcMain.on(channel, ipcAction);
};

const handle = (channel: ChannelsMain, ipcAction: IpcInvoke): void => {
  ipcMain.handle(channel, ipcAction);
};

on(ChannelsMain.fsMove, fsMoveIpcAction);
on(ChannelsMain.fsRemove, fsRemoveIpcAction);
on(ChannelsMain.openFileAsTab, openFileAsTabAction);
on(ChannelsMain.revealPathInOS, revealPathInOSAction);
on(ChannelsMain.logMessage, logMessageAction);

handle(ChannelsMain.browseFileSystem, browseFileSystemIpcInvoke);
handle(ChannelsMain.createNewProject, createNewProjectIpcInvoke);
handle(ChannelsMain.fspExists, fspExistsIpcInvoke);
handle(ChannelsMain.fspMkdir, fspMkdirIpcInvoke);
handle(ChannelsMain.fspWriteFile, fspWriteFileIpcInvoke);
handle(ChannelsMain.getXtoryTemplates, getXtoryTemplatesIpcInvoke);
handle(ChannelsMain.getFileTypes, getFileTypesIpcInvoke);
handle(ChannelsMain.openProject, openProjectIpcInvoke);
