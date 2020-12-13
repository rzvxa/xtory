const isMac = process.platform === 'darwin'

module.exports = function(mainWindow) {
    return [
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [{
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [{
                    label: 'New',
                    click: async () => {
                        mainWindow.webContents.executeJavaScript("clear()");
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Save',
                    click: async () => {
                        mainWindow.webContents.executeJavaScript("exportFile()");
                    }
                },
                {
                    label: 'Save As ...',
                    click: async () => {
                        mainWindow.webContents.executeJavaScript("exportFile()");
                    }
                },
                {
                    label: 'Load',
                    click: async () => {
                        mainWindow.webContents.executeJavaScript("importFile()");
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Export',
                    click: async () => {
                        mainWindow.webContents.executeJavaScript("exportGameFile");
                    }
                },
                isMac ? {
                    role: 'close'
                } : {
                    role: 'quit'
                }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [{
                    role: 'undo'
                },
                {
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'cut'
                },
                {
                    role: 'copy'
                },
                {
                    role: 'paste'
                },
                {
                    role: 'delete'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'selectAll'
                }
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [{
                    role: 'toggleDevTools'
                },
                {
                    role: 'togglefullscreen'
                }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [{
                    role: 'minimize'
                },
                ...(isMac ? [{
                        type: 'separator'
                    },
                    {
                        role: 'front'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        role: 'window'
                    }
                ] : [{
                    role: 'close'
                }])
            ]
        },
        {
            role: 'help',
            submenu: [{
                label: 'About',
                click: async () => {
                    const openAboutWindow = require('about-window').default
                    const {
                        join
                    } = require('path')
                    openAboutWindow({
                        icon_path: join(__dirname, 'app/img/logo.png'),
                        copyright: 'Copyright (c) 2019-2020 rzvxa',
                        package_json_dir: __dirname,
                        show_close_button: 'Close',
                    })
                }
            }]
        }
    ]

}
