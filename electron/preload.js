const { contextBridge } = require("electron");
const { ipcRenderer } = require("electron");

async function showDialog(message) {
    message = JSON.stringify(message);
    const result = await ipcRenderer.invoke('showDialog', message)
    return JSON.parse(result);
}

async function projectTree(path) {
    const result = await ipcRenderer.invoke('projectTree', path)
    return result;
}

contextBridge.exposeInMainWorld('electron', {
    showDialog: showDialog,
    setProjectPath: (path) => ipcRenderer.sent('setProjectPath', path),
    readFromFile: (path) => ipcRenderer.invoke('readFromFile', path),
    writeToFile: (file) => ipcRenderer.send('writeToFile', file),
    projectTree: projectTree,
    onProjectUpdate: (callback) => ipcRenderer.on('projectUpdate', (e, m) => callback(m)),
});
contextBridge.exposeInMainWorld('preloadWasRun', 'preload was run');
