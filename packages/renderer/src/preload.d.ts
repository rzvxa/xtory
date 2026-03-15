import { Platform } from '@xtory/shared';
import type { ElectronHandler } from 'main/preload';

import type { XtoryRenderer } from '@xtory/plugin-api/renderer';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    readonly electron: ElectronHandler;
    readonly platform: Platform;
    readonly renderer: XtoryRenderer;
  }
}

export {};
