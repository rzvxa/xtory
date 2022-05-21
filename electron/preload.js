const { contextBridge } = require("electron");
const { ipcRenderer } = require("electron");

function showDialog(message) {
    message = JSON.stringify(message);
    ipcRenderer.invoke("showDialog", message);
    const result = ipcRenderer.sendSync('showDialog', message)
    return JSON.parse(result);
}

async function projectTree(path) {
    const result = await ipcRenderer.invoke('projectTree', path)
    return result;
}

contextBridge.exposeInMainWorld('electron', {
    showDialog: showDialog,
    projectTree: projectTree,
    onProjectUpdate: (callback) => ipcRenderer.on('projectUpdate', callback)
});
contextBridge.exposeInMainWorld('preloadWasRun', 'preload was run');
