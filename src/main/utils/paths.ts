import path from 'path';
import { app } from 'electron';

import { IS_PRODUCTION } from 'main/constants';

export const appPath = app.getAppPath();
export const resourcesPath = IS_PRODUCTION ? path.dirname(appPath) : appPath;
export const assetsPath = path.join(resourcesPath, 'assets');
export const templatesPath = path.join(assetsPath, 'templates');
