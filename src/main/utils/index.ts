import { resolveHtmlPath } from './resolveHtmlPath';

import exists from './fsUtils/exists';

import { appPath, resourcesPath, assetsPath, templatesPath } from './paths';

import FileLogger from './fileLogger';

const fsUtils = {
  exists,
};

export {
  resolveHtmlPath,
  fsUtils,
  appPath,
  resourcesPath,
  assetsPath,
  templatesPath,
  FileLogger,
};
