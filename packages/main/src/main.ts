/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, protocol } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './utils';
import { setMainWindow } from './windowManager';

import project from './project';
import projectLoader from './project/projectLoader';
import './ipc/index';

// Register privileged scheme for plugins and assets
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'plugin',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
      corsEnabled: true,
    },
  },
  {
    scheme: 'resource',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
      corsEnabled: true,
    },
  },
]);

project.init(projectLoader);

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// eslint-disable-next-line import/prefer-default-export
export const getMainWindow = () => mainWindow;

ipcMain.on('customIPC', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  log.info(msgTemplate(arg));
  event.reply('customIPC', msgTemplate('projectUpdate'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch((err: Error) => log.error(err));
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../../.erb/dll/preload.js'),
    },
  });

  setMainWindow(mainWindow);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    setMainWindow(null);
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    // Register protocol to load local files (plugins)
    protocol.registerFileProtocol('plugin', (request, callback) => {
      try {
        const parsedUrl = new URL(request.url);
        const { hostname } = parsedUrl;
        let pathname = decodeURIComponent(parsedUrl.pathname);

        if (process.platform === 'win32') {
          if (hostname && hostname.length === 1) {
            // Handle URLs like plugin://c/Users/... -> C:\Users\...
            pathname = `${hostname.toUpperCase()}:${pathname}`;
          } else if (/^\/[A-Za-z]:/.test(pathname)) {
            // Handle URLs like plugin:///C:/Users/... -> remove the leading slash
            pathname = pathname.slice(1);
          }
        }

        const normalizedPath = path.normalize(pathname);
        return callback(normalizedPath);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return callback('404');
      }
    });

    // Register protocol to serve project resources by UUID
    protocol.registerFileProtocol('resource', (request, callback) => {
      try {
        const parsedUrl = new URL(request.url);
        // UUID is in the hostname part of resource://uuid/
        const uuid =
          parsedUrl.hostname ||
          parsedUrl.pathname.replace(/^\/+/, '').replace(/\/+$/, '');

        if (!uuid) {
          // eslint-disable-next-line no-console
          console.error(
            '[ResourceProtocol] No UUID found in URL:',
            request.url
          );
          return callback('404');
        }

        // Try to resolve UUID to file path via project resource service
        try {
          const projectInstance = require('./project').default;
          if (projectInstance.isOpen) {
            const resourcePath =
              projectInstance.resourceService.getResourcePath(uuid);
            if (resourcePath) {
              const absolutePath = path.join(
                projectInstance.path,
                resourcePath
              );
              return callback(path.normalize(absolutePath));
            } else {
              projectInstance.logger.warning(
                `ResourceService returned null for UUID: ${uuid}`,
                ['ResourceProtocol']
              );
            }
          } else {
            // eslint-disable-next-line no-console
            console.error('[ResourceProtocol] Project is not open');
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
            '[ResourceProtocol] Failed to resolve resource UUID:',
            error
          );
        }

        return callback('404');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[ResourceProtocol] Error:', error);
        return callback('404');
      }
    });

    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
