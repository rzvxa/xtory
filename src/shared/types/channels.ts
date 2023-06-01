export enum ChannelsMain {
  browseFileSystem = 'browseFileSystem',
  createNewProject = 'createNewProject',
  getXtoryTemplates = 'getXtoryTemplates',
  openProject = 'openProject',
  fspExists = 'fspExists',
  fspMkdir = 'fspMkdir',
  fsMove = 'fsMove',
  fsRemove = 'fsRemove',
  revealPathInOS = 'revealPathInOS',
  customIPC = 'customIPC',
}

export enum ChannelsRenderer {
  toastMessage = 'toastMessage',
  onProjectOpened = 'onProjectOpened',
  onProjectTreeUpdated = 'onProjectTreeUpdated',
}
