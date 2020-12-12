const {
    app,
    BrowserWindow,
    Menu
} = require('electron')

const menu_template = require('./menu-template')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('app/index.html')
}

const menu = Menu.buildFromTemplate(menu_template)
Menu.setApplicationMenu(menu)

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
