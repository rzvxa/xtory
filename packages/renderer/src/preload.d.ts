import { Platform } from '@xtory/shared';
import { ElectronHandler } from 'main/preload';
import type { XtoryRenderer } from '@xtory/plugin-api';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    platform: Platform;
    renderer: XtoryRenderer;
  }
}

export {};
