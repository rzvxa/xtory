import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
} from 'electron';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const menu = Menu.buildFromTemplate(this.menuTemplate());
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  menuTemplate() {
    const darwin = process.platform === 'darwin';
    const subMenuDarwinXtory: MenuItemConstructorOptions = {
      label: 'Xtory',
      submenu: [
        {
          label: 'About',
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuView: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: darwin ? 'Ctrl+Command+F' : 'F11',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };

    const subMenuDev: MenuItemConstructorOptions = {
      label: 'Developer',
      submenu: [
        {
          label: 'Reload',
          accelerator: darwin ? 'Command+R' : 'Ctrl+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: darwin ? 'Alt+Command+I' : 'Alt+Ctrl+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Github',
          click() {
            shell.openExternal('https://github.com/rzvxa/xtory');
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/rzvxa/xtory/issues');
          },
        },
        ...(darwin
          ? []
          : [
              { type: 'separator' as const },
              {
                label: 'About',
                click: () => {
                  dialog.showMessageBoxSync(this.mainWindow, {
                    title: 'About Xtory',
                    message: `Xtory ${XTORY_VERSION}\nLicensed under GPLv3\nGPL License: https://github.com/rzvxa/xtory/blob/master/LICENSE\nThird Party Licenses: https://github.com/rzvxa/xtory/blob/master/Third_Party_Licenses\nIf your license is missing please create an issue on the Github!`,
                  });
                },
              },
            ]),
      ],
    };

    return [
      ...(darwin ? [subMenuDarwinXtory] : []),
      subMenuView,
      ...(process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true' ||
      process.env.XTORY_DEVELOPER_MODE === 'true'
        ? [subMenuDev]
        : []),
      subMenuHelp,
    ];
  }
}
