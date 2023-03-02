const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

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

app.on('ready', createWindow);