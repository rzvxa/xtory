import { ipcMain } from 'electron';

import type { ChannelsMain, IpcAction, IpcInvoke } from '@xtory/plugin-api';

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
import serviceCallIpcInvoke from './invokes/serviceCall';

const on = (channel: ChannelsMain, ipcAction: IpcAction): void => {
  ipcMain.on(channel, ipcAction);
};

const handle = (channel: ChannelsMain, ipcAction: IpcInvoke): void => {
  ipcMain.handle(channel, ipcAction);
};

on('fsMove', fsMoveIpcAction);
on('fsRemove', fsRemoveIpcAction);
on('openFileAsTab', openFileAsTabAction);
on('revealPathInOS', revealPathInOSAction);
on('logMessage', logMessageAction);

handle('browseFileSystem', browseFileSystemIpcInvoke);
handle('createNewProject', createNewProjectIpcInvoke);
handle('fspExists', fspExistsIpcInvoke);
handle('fspMkdir', fspMkdirIpcInvoke);
handle('fspWriteFile', fspWriteFileIpcInvoke);
handle('getXtoryTemplates', getXtoryTemplatesIpcInvoke);
handle('getFileTypes', getFileTypesIpcInvoke);
handle('openProject', openProjectIpcInvoke);
handle('selectImageFile', selectImageFileIpcInvoke);
handle('importResource', importResourceIpcInvoke);
handle('getResources', getResourcesIpcInvoke);
handle('updateResourceMetadata', updateResourceMetadataIpcInvoke);
handle('removeResource', removeResourceIpcInvoke);
handle('getPluginConfig', getPluginConfigIpcInvoke);
handle('updatePluginConfig', updatePluginConfigIpcInvoke);
handle('updatePluginEnabled', updatePluginEnabledIpcInvoke);
handle('restartApp', restartAppIpcInvoke);
handle('getCharacters', getCharactersIpcInvoke);
handle('createCharacter', createCharacterIpcInvoke);
handle('updateCharacter', updateCharacterIpcInvoke);
handle('removeCharacter', removeCharacterIpcInvoke);
handle('getCharacterSettings', getCharacterSettingsIpcInvoke);
handle('updateCharacterSettings', updateCharacterSettingsIpcInvoke);
handle('serviceCall', serviceCallIpcInvoke);
