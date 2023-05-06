import { resolveHtmlPath } from './utils/resolveHtmlPath';

import { exists } from './utils/fsUtils/exists';

import {
  appPath,
  resourcesPath,
  assetsPath,
  templatesPath,
} from './utils/paths';

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
};
