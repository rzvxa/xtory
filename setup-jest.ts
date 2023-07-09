import { Platform } from 'shared/types';

Object.defineProperty(window, 'electron', {
  value: {
    ipcRenderer: {
      on: jest.fn(),
      once: jest.fn(),
      sendMessage: jest.fn(),
      invoke: jest.fn(async (channel): Promise<unknown> => {
        if (channel === 'getXtoryTemplates') {
          return ['Test'];
        }
        return undefined;
      }),
    },
  },
});

Object.defineProperty(window, 'platform', {
  value: process.platform as Platform,
});
