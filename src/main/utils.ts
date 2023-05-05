import { resolveHtmlPath } from './utils/resolveHtmlPath';

import { exists } from './utils/fsUtils/exists';

const fsUtils = {
  exists,
};

export { resolveHtmlPath, fsUtils };
