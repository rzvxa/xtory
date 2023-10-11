import { ipcMain } from 'electron';

import { ChannelsMain, IpcAction, IpcInvoke } from '@xtory/shared';

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
import selectImageFileIpcInvoke from './invokes/selectImageFile';
import importResourceIpcInvoke from './invokes/importResource';
import getResourcesIpcInvoke from './invokes/getResources';
import updateResourceMetadataIpcInvoke from './invokes/updateResourceMetadata';
import removeResourceIpcInvoke from './invokes/removeResource';
import getPluginConfigIpcInvoke from './invokes/getPluginConfig';
import updatePluginConfigIpcInvoke from './invokes/updatePluginConfig';
import updatePluginEnabledIpcInvoke from './invokes/updatePluginEnabled';
import restartAppIpcInvoke from './invokes/restartApp';
import getCharactersIpcInvoke from './invokes/getCharacters';
import createCharacterIpcInvoke from './invokes/createCharacter';
import updateCharacterIpcInvoke from './invokes/updateCharacter';
import removeCharacterIpcInvoke from './invokes/removeCharacter';
import getCharacterSettingsIpcInvoke from './invokes/getCharacterSettings';
import updateCharacterSettingsIpcInvoke from './invokes/updateCharacterSettings';

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
handle(ChannelsMain.selectImageFile, selectImageFileIpcInvoke);
handle(ChannelsMain.importResource, importResourceIpcInvoke);
handle(ChannelsMain.getResources, getResourcesIpcInvoke);
handle(ChannelsMain.updateResourceMetadata, updateResourceMetadataIpcInvoke);
handle(ChannelsMain.removeResource, removeResourceIpcInvoke);
handle(ChannelsMain.getPluginConfig, getPluginConfigIpcInvoke);
handle(ChannelsMain.updatePluginConfig, updatePluginConfigIpcInvoke);
handle(ChannelsMain.updatePluginEnabled, updatePluginEnabledIpcInvoke);
handle(ChannelsMain.restartApp, restartAppIpcInvoke);
handle(ChannelsMain.getCharacters, getCharactersIpcInvoke);
handle(ChannelsMain.createCharacter, createCharacterIpcInvoke);
handle(ChannelsMain.updateCharacter, updateCharacterIpcInvoke);
handle(ChannelsMain.removeCharacter, removeCharacterIpcInvoke);
handle(ChannelsMain.getCharacterSettings, getCharacterSettingsIpcInvoke);
handle(ChannelsMain.updateCharacterSettings, updateCharacterSettingsIpcInvoke);
