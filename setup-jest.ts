import { Platform } from 'shared/types';

Object.defineProperty(window, 'electron', {
  value: {
    ipcRenderer: {
      on: jest.fn(),
      once: jest.fn(),
      sendMessage: jest.fn(),
      invoke: jest.fn(async (channel) => {
        if (channel === 'getXtoryTemplates') {
          return ['Test'];
        }
        return;
      }),
    },
  },
});

Object.defineProperty(window, 'platform', {
  value: process.platform as Platform,
});
