export enum ChannelsMain {
  browseFileSystem = 'browseFileSystem',
  createNewProject = 'createNewProject',
  getXtoryTemplates = 'getXtoryTemplates',
  openProject = 'openProject',
  openFileAsTab = 'openFileAsTab',
  fspExists = 'fspExists',
  fspMkdir = 'fspMkdir',
  fspWriteFile = 'fspWriteFile',
  fsMove = 'fsMove',
  fsRemove = 'fsRemove',
  revealPathInOS = 'revealPathInOS',
  customIPC = 'customIPC',
  logMessage = 'logMessage',
}

export enum ChannelsRenderer {
  broadcastLogMessage = 'broadcastLogMessage',
  toastMessage = 'toastMessage',
  onProjectOpened = 'onProjectOpened',
  onOpenFileAsTab = 'onOpenFileAsTab',
  onProjectTreeUpdated = 'onProjectTreeUpdated',
}
