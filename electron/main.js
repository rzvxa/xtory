const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const chokidar = require('chokidar');
const { readdirRecursive } = require('./async-fs');

let mainWindow;
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

let projectPath = null;
let watcher = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        show: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../public/favicon.ico'),
        webPreferences: {
            preload: path.resolve(__dirname, 'preload.js'),
        },
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

    myConsole.log(path.join(__dirname, 'preload.js'));
    mainWindow.loadURL(startURL);
    // mainWindow.setMenu(null);

    console.log(projectPath);
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

const watcherCallback = (type) => (path) => {
    if (type === 'error') {
        myConsole.log('error@', path);
    } else {
        myConsole.log('File opeation at', path, 'type', type);
    }
    mainWindow.webContents.send('projectUpdate', {path: projectPath, update: path});
};

function setProjectPath(e, path) {
    if (projectPath !== path) {
        projectPath = path;
        if (watcher !== null) {
            watcher.close();
        }
        watcher = chokidar.watch(path, {ignored: /^\./, persistent: true});
        watcher
          .on('add', watcherCallback('add'))
          .on('change', watcherCallback('change'))
          .on('unlink', watcherCallback('unlink'))
          .on('error', watcherCallback('error'))
        myConsole.log(path);
    }
}

app.on('ready', createWindow);

ipcMain.on('setProjectPath', setProjectPath);

ipcMain.handle("projectTree", async (e, path) => {
    setProjectPath(e, path);
    return readdirRecursive(path)
});

ipcMain.handle("showDialog", (e, message) => {
    message = JSON.parse(message);
    var result = dialog.showOpenDialog(mainWindow, message);
    myConsole.log(result);
    e.returnValue = JSON.stringify(result);
});
